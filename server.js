const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);
const port = process.env.PORT || 3000;

const accessControlAllowOrigin = (request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*');
  response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  response.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Content-Length, X-Requested-With, x-token'
  );
  next();
};

const httpsRedirect = (request, response, next) => {
  if( request.headers['x-forwarded-proto'] !== 'https') {
    return response.redirect('https://' + request.get('host') + request.url);
  }

  next();
}

app.locals.title = 'Garage Bin';

app.set('port', port);

if (environment !== 'development' && environment !== 'test') {
  app.use(httpsRedirect)
} else if (environment !== 'test') {
  app.use(accessControlAllowOrigin)
}

app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(express.static(path.join(__dirname, 'public')));

///// GET ALL GARAGE ITEMS /////
app.get('/api/v1/garage-bin', (request, response) => {
  database('garage_items')
    .select()
    .then(garageItems => {
      return response.status(200).json(garageItems);
    })
    .catch(error => {
      return response.status(500).json({ error });
    });
});

/////GET GARAGE ITEM BY ID/////
app.get('/api/v1/garage-bin/:itemId', (request, response) => {
  const { itemId } = request.params;

  database('garage_items')
    .where('id', itemId)
    .select()
    .then(item => {
      if (!item.length) {
        return response.status(404).json({
          error: `Could not find garage item with id of ${itemId}.`
        });
      } else {
        return response.status(200).json(item);
      }
    })
    .catch(error => {
      return response.status(500).json({ error });
    });
});

///// POST NEW GARAGE ITEM /////
app.post('/api/v1/garage-bin', (request, response) => {
  const newItem = request.body;

  for (let requiredParameter of ['name', 'reason', 'cleanliness']) {
    if (!newItem[requiredParameter]) {
      return response.status(422).json({
        error: `You are missing the required parameter ${requiredParameter}.`
      });
    }
  }

  database('garage_items')
    .insert(newItem, 'id')
    .then(itemId => {
      return response.status(201).json({ id: itemId[0] });
    })
    .catch(error => {
      return response.status(500).json({ error });
    });
});

///// PUT NEW ITEM CLEANLINESS /////
app.put('/api/v1/garage-bin/:itemId', async (request, response) => {
  const { itemId } = request.params;
  const updatedCleanliness = request.body;

  for (let requiredParameter of ['cleanliness']) {
    if (!updatedCleanliness[requiredParameter]) {
      return response
        .status(422)
        .json({
          error: `You are missing the required parameter ${requiredParameter}`
        });
    }
  }

  const itemToUpdate = await database('garage_items')
    .where('id', itemId)
    .select();

  if (!itemToUpdate.length) {
    return response
      .status(404)
      .json({ error: `Item by id ${itemId} not found.` });
  }

  await database('garage_items')
    .where('id', itemId)
    .update(updatedCleanliness)
    .then(() => {
      return response.status(201).send({
        success: `Garage item ${itemId} cleanliness updated to ${updatedCleanliness.cleanliness}.`
      });
    })
    .catch(error => {
      return response.status(500).json({ error });
    });
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

module.exports = app

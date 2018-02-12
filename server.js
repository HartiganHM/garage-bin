const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);
const port = process.env.PORT || 3000;

app.locals.title = 'Garage Bin';

app.set('port', port);

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

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});

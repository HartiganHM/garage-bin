process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const knex = require('../db/knex');

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('Should return the homepage', () => {
    return chai
      .request(server)
      .get('/')
      .then(response => {
        response.should.have.status(200);
        response.should.be.html;
      })
      .catch(error => {
        throw error;
      });
  });

  it('Should return a 404 error for a route that does not exists', () => {
    return chai
      .request(server)
      .get('/cat-hat-party')
      .then(response => {
        response.should.have.status(404);
      })
      .catch(error => {
        throw error;
      });
  });
});

describe('API Routes', () => {
  describe('GET all items', () => {
    beforeEach(done => {
      knex.seed.run().then(() => {
        done();
      });
    });

    it('Should get all items', () => {
      return chai
        .request(server)
        .get('/api/v1/garage-bin')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(3);
          response.body[0].should.have.property('id');
          response.body[0].should.have.property('name');
          response.body[0].should.have.property('reason');
          response.body[0].should.have.property('cleanliness');
        })
        .catch(error => {
          throw error;
        });
    });
  });

  describe('GET item by id', () => {
    beforeEach(done => {
      knex.seed.run().then(() => {
        done();
      });
    });

    it('Should get an item by id', () => {
      return chai
        .request(server)
        .get('/api/v1/garage-bin/1')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          response.body[0].should.have.property('id');
          response.body[0].id.should.equal(1);
          response.body[0].should.have.property('name');
          response.body[0].should.have.property('reason');
          response.body[0].should.have.property('cleanliness');
        })
        .catch(error => {
          throw error;
        });
    });

    it('Should return a 404 error if item is not found', () => {
      return chai
        .request(server)
        .get('/api/v1/garage-bin/0')
        .then(response => {
          response.should.have.status(404);
          response.should.be.json;
          response.error.text.should.equal(
            '{"error":"Could not find garage item with id of 0."}'
          );
        })
        .catch(error => {
          throw error;
        });
    });
  });

  describe('POST new item', () => {
    beforeEach(done => {
      knex.seed.run().then(() => {
        done();
      });
    });

    it('Should create a new item', () => {
      return chai
        .request(server)
        .post('/api/v1/garage-bin')
        .send({
          name: 'Garbage Fire',
          reason: 'I don\'t know how to put it out!',
          cleanliness: 'Sparkinlg'
        })
        .then(response => {
          response.should.have.status(201);
          response.should.be.json;
        })
        .catch(error => {
          throw error;
        });
    });
  });
});

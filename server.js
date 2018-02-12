const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);
const port = process.env.PORT || 3000;

app.locals.title = 'Garage Bin';

app.set('port', port);
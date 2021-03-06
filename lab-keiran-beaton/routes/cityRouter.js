'use strict';
const express = require('express');
const City = require('../models/city');
const jsonParser = require('body-parser').json();
const handleError = require('../lib/handleError');
const cityFriendsRouter = require('./cityFriendsRouter');

let cityRouter = module.exports = exports = express.Router();

cityRouter.get('/', (req, res, next) => {
  let handleDbError = handleError(500, next, 'Database Error');
  City.findOne({'_id': req.params.id}).then(res.json.bind(res), handleDbError);
});

cityRouter.get('/:id', (req, res, next) => {
  let handleDbError = handleError(400, next, 'invalid id');
  let fourOhFour = handleError(404, next);
  City.findOne({'_id': req.params.id}).then((data) => {
    if (!data) return next(fourOhFour(new Error('City not found.')));
    res.json(data);
  }, handleDbError);
});

cityRouter.post('/', jsonParser, (req, res, next) => {
  let handleBadValidation = handleError(400, next);
  (City(req.body)).save().then(res.json.bind(res), handleBadValidation);
});

cityRouter.put('/:id', jsonParser, (req, res, next) => {
  (City.findOneAndUpdate({'_id': req.params.id}, req.body).then(res.json.bind(res), handleError(400, next)));
});

cityRouter.delete('/:id', (req, res, next) => {
  (City.remove({'_id': req.params.id})).then(res.json.bind(res), handleError(400, next, 'Bad _id'));
});

cityRouter.use('/:cityId/friend', cityFriendsRouter);

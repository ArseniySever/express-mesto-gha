const express = require('express');

const bodyParser = require('body-parser');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');

const cardsRoutes = require('./routes/cards');
const userRoutes = require('./routes/users');
const error = require('./middlewares/error');
const { ForbiddenError } = require('./error/ForbiddenError');

const { login, createUser } = require('./controllers/users');

const { PORT = 3000 } = process.env;

mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb', {
    useNewUrlParser: true,
  });

const app = express();

app.use(bodyParser.json());
app.use(helmet());

app.use('/users', userRoutes);
app.use('/cards', cardsRoutes);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/https?:\/\/(www)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?$/i),
  }).unknown(true),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }).unknown(true),
}), login);

app.use('*', new ForbiddenError('Routes not found'));

app.use(error);
app.use(errors());

app.listen(PORT);

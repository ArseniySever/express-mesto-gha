const express = require('express');

const bodyParser = require('body-parser');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');

const cardsRoutes = require('./routes/cards');
const userRoutes = require('./routes/users');
const { auth } = require('./middlewares/auth');
const error = require('./middlewares/error');

const { login, createUser } = require('./controllers/users');

const { PORT = 3000 } = process.env;

mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb', {
    useNewUrlParser: true,
  });

const app = express();

app.use(bodyParser.json());
app.use(helmet());

app.use('/users', auth, userRoutes);
app.use('/cards', auth, cardsRoutes);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/https?:\/\/(www)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?$/i),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Routes not found' });
});
app.use(error);

app.listen(PORT);

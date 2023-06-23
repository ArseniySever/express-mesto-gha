const express = require('express');

const bodyParser = require('body-parser');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { validateUserCreate, validateUserLogin } = require('./middlewares/joi');

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
app.use(errors());

app.post('/signin', validateUserLogin, login);

app.post('/signup', validateUserCreate, createUser);

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Routes not found' });
});
app.use(error);

app.listen(PORT);

const express = require('express');

const bodyParser = require('body-parser');
const helmet = require('helmet');
const mongoose = require('mongoose');

const cardsRoutes = require('./routes/cards');
const userRoutes = require('./routes/users');
const { auth } = require('./middlewares/auth');
const error = require('./middlewares/error');
const celebrate = require('./middlewares/joi');

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

app.post('/signin', login);

app.post('/signup', createUser);

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Routes not found' });
});
app.use(error);
app.use(celebrate);

app.listen(PORT);

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cardsRoutes = require('./routes/cards');
const userRoutes = require('./routes/users');

const { PORT = 3000 } = process.env;

mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb', {
    useNewUrlParser: true,
  });

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '648473a9a75e826771563615',
  };

  next();
});
app.use('/users', userRoutes);
app.use('/cards', cardsRoutes);

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Routes not found' });
});

app.listen(PORT);

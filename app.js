const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
const router = require("express").Router();
const userRoutes = require("./routes/users");
const cardsRoutes = require("./routes/cards");
const { PORT = 3000 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/mestodb", {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("connected to db");
  });

const app = express();

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: "648473a9a75e826771563615",
  };

  next();
});
app.use("/users", userRoutes);
app.use("/cards", cardsRoutes);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

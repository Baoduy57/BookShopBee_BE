const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();

const app = express();
const port = process.env.PORT || 3003;

app.get("/", (req, res) => {
  res.send("Welcome to the API! hihihihi");
});

console.log("process.env.MONGO_DB", process.env.MONGO_DB);

mongoose
  .connect(
    `mongodb+srv://BaoDuy:${process.env.MONGO_DB}@dbbookshop.lklja.mongodb.net/?retryWrites=true&w=majority&appName=DBBookShop`
  )
  .then(() => {
    console.log("Connected to MongoDB success!");
  })
  .catch((err) => {
    console.log(err);
  });
app.listen(port, () => {
  console.log("Server is running in port " + port);
});

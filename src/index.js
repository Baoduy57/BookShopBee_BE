const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const routes = require("./routes");
const bodyParser = require("body-parser");
dotenv.config();

const app = express();
const port = process.env.PORT || 3003;

app.use(bodyParser.json());

routes(app);

console.log("process.env.MONGO_DB", process.env.MONGO_DB);

mongoose
  .connect(`${process.env.MONGO_DB}`)
  .then(() => {
    console.log("Connected to MongoDB success!");
  })
  .catch((err) => {
    console.log(err);
  });
app.listen(port, () => {
  console.log("Server is running in port " + port);
});
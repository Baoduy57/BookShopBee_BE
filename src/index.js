const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = process.env.PORT || 3003;

app.get("/", (req, res) => {
  res.send("Welcome to the API! hihihihi");
});
app.listen(port, () => {
  console.log("Server is running in port " + port);
});

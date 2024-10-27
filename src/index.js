const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const routes = require("./routes");
// const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
dotenv.config();

const app = express();
const port = process.env.PORT || 3003;

app.use(
  cors({
    origin: "http://localhost:3000", // Thay đổi thành địa chỉ client của bạn
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Cho phép gửi cookie
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

routes(app);

mongoose
  .connect(process.env.MONGO_DB, {
    serverSelectionTimeoutMS: 5000, // Thời gian chờ kết nối là 5 giây
  })
  .then(() => {
    console.log("Connected to MongoDB success!");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(port, () => {
  console.log("Server is running in port " + port);
});

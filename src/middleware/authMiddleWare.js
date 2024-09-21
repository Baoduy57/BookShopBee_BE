const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const authMiddleWare = (req, res, next) => {
  const token = req.headers.token.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
    if (err) {
      return res.status(404).json({
        message: "The authenticated",
        status: "ERROR",
      });
    }
    console.log("user", user);
    const { payload } = user;
    if (payload?.isAdmin) {
      next();
    } else {
      return res.status(404).json({
        message: "The authenticated",
        status: "ERROR",
      });
    }
  });
};

module.exports = { authMiddleWare };

const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// const authMiddleWare = (req, res, next) => {
//   const token = req.headers.token.split(" ")[1];
//   jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
//     if (err) {
//       return res.status(404).json({
//         message: "The authenticated",
//         status: "ERROR",
//       });
//     }
//     console.log("user", user);
//     // const { payload } = user;
//     if (user?.isAdmin) {
//       next();
//     } else {
//       return res.status(404).json({
//         message: "The authenticated",
//         status: "ERROR",
//       });
//     }
//   });
// };

const authMiddleWare = (req, res, next) => {
  const authHeader = req.headers.token;

  // Kiểm tra nếu không có token trong headers
  if (!authHeader) {
    return res.status(401).json({
      message: "No token provided",
      status: "ERROR",
    });
  }

  const token = authHeader.split(" ")[1]; // Lấy token sau "Bearer"

  // Xác thực token
  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) {
      return res.status(403).json({
        message: "Token verification failed",
        status: "ERROR",
      });
    }

    // Kiểm tra quyền admin
    if (user?.isAdmin) {
      next(); // Người dùng là admin, cho phép tiếp tục
    } else {
      return res.status(403).json({
        message: "Access denied, not an admin",
        status: "ERROR",
      });
    }
  });
};

// const authUserMiddleWare = (req, res, next) => {
//   const token = req.headers.token.split(" ")[1];
//   const userId = req.params.id;
//   jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
//     if (err) {
//       return res.status(404).json({
//         message: "The authenticated",
//         status: "ERROR",
//       });
//     }
//     console.log("user", user);
//     // const { payload } = user;
//     if (user.isAdmin || user?.id === userId) {
//       next();
//     } else {
//       return res.status(404).json({
//         message: "The authenticated",
//         status: "ERROR",
//       });
//     }
//   });
// };

const authUserMiddleWare = (req, res, next) => {
  const authHeader = req.headers.token; // Lấy token từ headers
  if (!authHeader) {
    return res.status(401).json({
      message: "No token provided",
      status: "ERROR",
    });
  }

  const token = authHeader.split(" ")[1]; // Tách 'Bearer <token>'
  if (!token) {
    return res.status(401).json({
      message: "Invalid token format",
      status: "ERROR",
    });
  }

  // const userId = req.params.id; // Lấy userId từ params

  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
    if (err) {
      return res.status(403).json({
        message: "Token verification failed",
        status: "ERROR",
      });
    }

    // Kiểm tra quyền admin hoặc user.id có khớp với userId trong params không
    if (user?.isAdmin || user?.id) {
      req.user = user; // Lưu thông tin user vào req để sử dụng sau này
      next(); // Nếu đúng thì cho phép tiếp tục
    } else {
      return res.status(403).json({
        message: "Permission denied",
        status: "ERROR",
      });
    }
  });
};

module.exports = { authMiddleWare, authUserMiddleWare };

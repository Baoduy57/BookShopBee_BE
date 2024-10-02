const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const genneralAccessToken = async (payload) => {
  const access_token = jwt.sign(
    {
      ...payload,
    },
    process.env.ACCESS_TOKEN,
    { expiresIn: "15m" }
  );
  return access_token;
};

const genneralRefreshToken = async (payload) => {
  const refresh_token = jwt.sign(
    {
      ...payload,
    },
    process.env.REFRESH_TOKEN,
    { expiresIn: "365d" }
  );
  return refresh_token;
};

// const refreshTokenJwtService = async (token) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       console.log("token", token);
//       jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
//         if (err) {
//           resolve({
//             status: "ERR",
//             message: "The authemtication",
//           });
//         }
//         console.log("user", user);

//         const access_token = await genneralAccessToken({
//           id: user?.id,
//           // email: payload.email,
//           isAdmin: user?.isAdmin,
//         });

//         console.log("access token", access_token);
//         resolve({
//           status: "OK",
//           message: "Successfully",
//           access_token,
//         });
//       });
//     } catch (e) {
//       reject(e);
//     }
//   });
// };

const refreshTokenJwtService = async (token) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("token", token);

      // Kiểm tra token có tồn tại không
      if (!token) {
        return resolve({
          status: "ERR",
          message: "No token provided",
        });
      }

      jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            return resolve({
              status: "ERR",
              message: "Refresh token expired",
            });
          }
          console.error("JWT Verification Error:", err);
          return resolve({
            status: "ERR",
            message: "Token verification failed",
          });
        }
        // Tiếp tục tạo access token mới nếu không có lỗi

        console.log("user", user);

        // Tạo access token mới
        try {
          const access_token = await genneralAccessToken({
            id: user?.id,
            isAdmin: user?.isAdmin,
          });

          console.log("access token", access_token);

          resolve({
            status: "OK",
            message: "Successfully",
            access_token,
          });
        } catch (tokenError) {
          console.error("Error generating access token:", tokenError);
          return resolve({
            status: "ERR",
            message: "Failed to generate access token",
          });
        }
      });
    } catch (e) {
      console.error("Error in refreshTokenJwtService:", e); // Logging lỗi bên ngoài
      reject({
        status: "ERR",
        message: "Internal server error",
      });
    }
  });
};

module.exports = {
  genneralAccessToken,
  genneralRefreshToken,
  refreshTokenJwtService,
};

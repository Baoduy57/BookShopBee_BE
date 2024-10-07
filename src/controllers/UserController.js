const { response } = require("express");
const UserService = require("../services/UserService");
const JwtService = require("../services/jwtService");

// tao user
const createUser = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;
    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    const isCheckEmail = reg.test(email);
    if (!email || !password || !confirmPassword) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is requied",
      });
    } else if (!isCheckEmail) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is email",
      });
    } else if (password !== confirmPassword) {
      return res.status(200).json({
        status: "ERR",
        message: "The password is equal to the confirmPassword",
      });
    }

    const respone = await UserService.createUser(req.body);
    return res.status(200).json(respone);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

// dang nhap user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    const isCheckEmail = reg.test(email);
    if (!email || !password) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is requied",
      });
    } else if (!isCheckEmail) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is email",
      });
    }

    const response = await UserService.loginUser(req.body);
    const { refresh_token, ...newResponse } = response;
    // console.log('response', response);
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: false,
      samesite: "strict",
    });
    return res.status(200).json(newResponse);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

//cap nhat user
// const updateUser = async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const data = req.body;
//     if (!userId) {
//       return res.status(200).json({
//         status: "ERR",
//         message: "User ID is not exist",
//       });
//     }
//     // console.log("userId: ", userId);
//     // console.log("data", data);
//     const respone = await UserService.updateUser(userId, data);
//     return res.status(200).json(respone);
//   } catch (e) {
//     return res.status(404).json({
//       message: e,
//     });
//   }
// };

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const data = req.body;

    if (!userId) {
      return res.status(400).json({
        status: "ERR",
        message: "User ID is required",
      });
    }

    // Cập nhật user qua UserService
    const response = await UserService.updateUser(userId, data);

    if (response.status === "OK") {
      return res.status(200).json(response); // Trả về kết quả cập nhật thành công
    } else {
      return res.status(400).json({
        status: "ERR",
        message: response.message || "Failed to update user",
      });
    }
  } catch (e) {
    // Log lỗi chi tiết
    console.error("Update user error:", e);

    return res.status(500).json({
      status: "ERR",
      message: "Internal Server Error",
      error: e.message,
    });
  }
};

//xoa user
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    // const token = req.headers;
    // console.log("token", token);
    // console.log("userId", userId);

    if (!userId) {
      return res.status(200).json({
        status: "ERR",
        message: "User ID is not exist",
      });
    }

    const respone = await UserService.deleteUser(userId);
    return res.status(200).json(respone);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

// lay tat ca user
const getAllUser = async (req, res) => {
  try {
    const respone = await UserService.getAllUser();
    return res.status(200).json(respone);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

// const getDetailsUser = async (req, res) => {
//   try {
//     const userId = req.params.id;

//     if (!userId) {
//       return res.status(400).json({
//         status: "ERR",
//         message: "User ID is not exist",
//       });
//     }

//     const respone = await UserService.getDetailsUser(userId);
//     return res.status(200).json(respone);
//   } catch (e) {
//     return res.status(404).json({
//       message: e,
//     });
//   }
// };

const getDetailsUser = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({
        status: "ERR",
        message: "User ID is not provided",
      });
    }

    const response = await UserService.getDetailsUser(userId);

    if (response.status === "OK" && response.data) {
      return res.status(200).json(response);
    } else {
      return res.status(404).json({
        status: "ERR",
        message: response.message || "User not found",
      });
    }
  } catch (e) {
    return res.status(500).json({
      message: "An error occurred: " + e.message,
    });
  }
};

const refreshToken = async (req, res) => {
  // console.log("req.cookies", req.cookies);
  try {
    const token = req.cookies.refresh_token;

    if (!token) {
      return res.status(200).json({
        status: "ERR",
        message: "The token is not exist",
      });
    }

    const respone = await JwtService.refreshTokenJwtService(token);
    return res.status(200).json(respone);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

// const logoutUser = async (req, res) => {
//   // console.log("req.cookies", req.cookies);
//   try {
//     res.clearCookie("refresh_token");
//     return res.status(200).json({
//       status: "OK",
//       message: "Logout success",
//     });
//   } catch (e) {
//     return res.status(404).json({
//       message: e,
//     });
//   }
// };

const logoutUser = async (req, res) => {
  try {
    // Xóa cookie chứa refresh_token
    res.clearCookie("refresh_token", {
      httpOnly: true, // Đảm bảo cookie không thể truy cập từ JavaScript
      secure: true, // Chỉ sử dụng cookie trên HTTPS (chỉ bật khi dùng HTTPS)
      sameSite: "Strict", // Ngăn chặn gửi cookie tới các domain khác (nếu cần)
    });

    // Trả về phản hồi đăng xuất thành công
    return res.status(200).json({
      status: "OK",
      message: "Logout successful",
    });
  } catch (e) {
    console.error("Error during logout:", e);

    // Trả về phản hồi lỗi
    return res.status(500).json({
      status: "ERROR",
      message: "Logout failed",
      error: e.toString(), // Bạn có thể log chi tiết lỗi
    });
  }
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
  getDetailsUser,
  refreshToken,
  logoutUser,
};

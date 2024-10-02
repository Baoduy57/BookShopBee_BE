const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { genneralAccessToken, genneralRefreshToken } = require("./jwtService");

// tao doi tuong moi
const createUser = (newUser) => {
  return new Promise(async (resolve, reject) => {
    const { name, email, password, confirmPassword, phone } = newUser;
    try {
      const checkUser = await User.findOne({
        email: email,
      });
      if (checkUser !== null) {
        resolve({
          status: "ERR",
          message: "The email is exist",
        });
      }

      const hash = bcrypt.hashSync(password, 10);

      const createdUser = await User.create({
        name,
        email,
        password: hash,
        confirmPassword: hash,
        phone,
      });
      if (createdUser) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: createdUser,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

// dang nhap doi tuong
const loginUser = (userLogin) => {
  return new Promise(async (resolve, reject) => {
    const { email, password } = userLogin;

    try {
      const checkUser = await User.findOne({
        email: email,
      });
      if (checkUser === null) {
        resolve({
          status: "ERR",
          message: "The user does not exist",
        });
      }

      const comparePassword = bcrypt.compareSync(password, checkUser.password);

      if (!comparePassword) {
        resolve({
          status: "ERR",
          message: "The password or user incorrect",
        });
      }

      const access_token = await genneralAccessToken({
        id: checkUser.id,
        email: checkUser.email,
        isAdmin: checkUser.isAdmin,
      });
      const refresh_token = await genneralRefreshToken({
        id: checkUser.id,
        email: checkUser.email,
        isAdmin: checkUser.isAdmin,
      });

      resolve({
        status: "OK",
        message: "Login successfully",
        access_token,
        refresh_token,
      });
    } catch (e) {
      reject(e);
    }
  });
};

// cap nhat user
// const updateUser = (id, data) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const checkUser = await User.findOne({
//         _id: id,
//       });

//       if (checkUser === null) {
//         resolve({
//           status: "OK",
//           message: "The userID does not exist",
//         });
//       }

//       const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });

//       resolve({
//         status: "OK",
//         message: "Successfully",
//         data: updatedUser,
//       });
//     } catch (e) {
//       reject(e);
//     }
//   });
// };

const updateUser = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({ _id: id });

      if (!checkUser) {
        // Trả về lỗi khi không tìm thấy user
        resolve({
          status: "ERR",
          message: "The userID does not exist",
        });
      }

      // Cập nhật user
      const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });

      if (!updatedUser) {
        resolve({
          status: "ERR",
          message: "Failed to update user",
        });
      }

      resolve({
        status: "OK",
        message: "Successfully updated user",
        data: updatedUser,
      });
    } catch (e) {
      reject({
        status: "ERR",
        message: "Internal server error",
        error: e.message,
      });
    }
  });
};

// const updateUser = async (id, data) => {
//   try {
//     const checkUser = await User.findById(id); // Sử dụng findById để tìm người dùng

//     if (!checkUser) {
//       return {
//         status: "NOT_FOUND",
//         message: "The userID does not exist",
//       };
//     }

//     const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });

//     return {
//       status: "OK",
//       message: "Successfully updated the user",
//       data: updatedUser,
//     };
//   } catch (error) {
//     console.error("Error updating user:", error); // Ghi lại lỗi
//     throw {
//       status: "ERROR",
//       message: "Failed to update the user",
//       error: error.message,
//     };
//   }
// };

// xoa user
const deleteUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({
        _id: id,
      });

      if (checkUser === null) {
        resolve({
          status: "OK",
          message: "The userID does not exist",
        });
      }

      await User.findByIdAndDelete(id);

      resolve({
        status: "OK",
        message: "Delete user Successfully",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allUser = await User.find();
      resolve({
        status: "OK",
        message: "All user Successfully",
        data: allUser,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailsUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({
        _id: id,
      });

      if (user === null) {
        resolve({
          status: "OK",
          message: "The userID does not exist",
        });
      }

      resolve({
        status: "OK",
        message: "Successfully",
        data: user,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
  getDetailsUser,
};

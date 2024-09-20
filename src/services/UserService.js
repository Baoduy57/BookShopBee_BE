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
          status: "OK",
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
    const { name, email, password, confirmPassword, phone } = userLogin;

    try {
      const checkUser = await User.findOne({
        email: email,
      });
      if (checkUser === null) {
        resolve({
          status: "OK",
          message: "The user does not exist",
        });
      }

      const comparePassword = bcrypt.compareSync(password, checkUser.password);

      if (!comparePassword) {
        resolve({
          status: "OK",
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

const updateUser = (id, data) => {
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

      const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });

      resolve({
        status: "OK",
        message: "Successfully",
        data: updatedUser,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = { createUser, loginUser, updateUser };

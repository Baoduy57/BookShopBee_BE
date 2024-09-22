const Product = require("../models/ProductModel");

// tao doi tuong moi
const createProduct = (newProduct) => {
  return new Promise(async (resolve, reject) => {
    const { name, image, type, price, countInStock, rating, description } =
      newProduct;

    try {
      const checkProduct = await Product.findOne({
        name: name,
      });
      if (checkProduct !== null) {
        resolve({
          status: "OK",
          message: "The name of product is exist",
        });
      }

      const createdProduct = await Product.create({
        name,
        image,
        type,
        price,
        countInStock,
        rating,
        description,
      });
      if (createdProduct) {
        resolve({
          status: "OK",
          message: "Create Product SUCCESS",
          data: createdProduct,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateProduct = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({
        _id: id,
      });

      if (checkProduct === null) {
        resolve({
          status: "OK",
          message: "The ProductID does not exist",
        });
      }

      const updatedProduct = await Product.findByIdAndUpdate(id, data, {
        new: true,
      });

      resolve({
        status: "OK",
        message: "Update Product Successfully",
        data: updatedProduct,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findOne({
        _id: id,
      });

      if (product === null) {
        resolve({
          status: "OK",
          message: "The productID does not exist",
        });
      }

      resolve({
        status: "OK",
        message: "Details Product Successfully",
        data: product,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({
        _id: id,
      });

      if (checkProduct === null) {
        resolve({
          status: "OK",
          message: "The productID does not exist",
        });
      }

      await Product.findByIdAndDelete(id);

      resolve({
        status: "OK",
        message: "Delete products Successfully",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllProduct = (limit = 8, page = 0) => {
  console.log("page", typeof page);
  return new Promise(async (resolve, reject) => {
    try {
      const totalProduct = await Product.countDocuments();
      const allProduct = await Product.find()
        .limit(limit)
        .skip(page * limit);
      resolve({
        status: "OK",
        message: "All product Successfully",
        data: allProduct,
        total: totalProduct,
        pageCurrent: page + 1,
        totalPage: Math.ceil(totalProduct / limit),
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createProduct,
  updateProduct,
  getDetailProduct,
  deleteProduct,
  getAllProduct,
};

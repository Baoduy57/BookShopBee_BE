const Product = require("../models/ProductModel");

// tao doi tuong moi
// const createProduct = (newProduct) => {
//   return new Promise(async (resolve, reject) => {
//     const { name, image, type, price, countInStock, rating, description } =
//       newProduct;

//     try {
//       const checkProduct = await Product.findOne({
//         name: name,
//       });
//       if (checkProduct !== null) {
//         resolve({
//           status: "OK",
//           message: "The name of product is exist",
//         });
//       }

//       const createdProduct = await Product.create({
//         name,
//         image,
//         type,
//         price,
//         countInStock,
//         rating,
//         description,
//       });
//       if (createdProduct) {
//         resolve({
//           status: "OK",
//           message: "Create Product SUCCESS",
//           data: createdProduct,
//         });
//       }
//     } catch (e) {
//       reject(e);
//     }
//   });
// };

const createProduct = (newProduct) => {
  return new Promise(async (resolve, reject) => {
    const { name, image, type, price, countInStock, rating, description } =
      newProduct;

    try {
      // Kiểm tra xem sản phẩm có tồn tại không
      const checkProduct = await Product.findOne({ name });

      if (checkProduct) {
        // Nếu sản phẩm đã tồn tại, trả về thông báo lỗi
        return resolve({
          status: "ERR",
          message: "The name of the product already exists",
        });
      }

      // Tạo mới sản phẩm
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
        // Trả về sản phẩm được tạo thành công
        return resolve({
          status: "OK",
          message: "Product created successfully",
          data: createdProduct,
        });
      } else {
        // Trường hợp tạo sản phẩm thất bại
        return reject({
          status: "ERR",
          message: "Failed to create product",
        });
      }
    } catch (e) {
      // Xử lý ngoại lệ khi thực hiện query
      return reject({
        status: "ERR",
        message: e.message || "Internal server error",
      });
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
          data: null, // Đảm bảo data là null
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

const deleteManyProduct = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      await Product.deleteMany({ _id: ids });

      resolve({
        status: "OK",
        message: "Delete many products Successfully",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllProduct = (limit, page, sort, filter) => {
  console.log("sort", sort);
  // console.log("page", typeof page);
  return new Promise(async (resolve, reject) => {
    try {
      const totalProduct = await Product.countDocuments();
      if (filter) {
        const label = filter[0];
        const allObjectFilter = await Product.find({
          [label]: { $regex: filter[1] },
        })
          .limit(limit)
          .skip(page * limit);

        resolve({
          status: "OK",
          message: "All product Successfully",
          data: allObjectFilter,
          total: totalProduct,
          pageCurrent: Number(page + 1),
          totalPage: Math.ceil(totalProduct / limit),
        });
      }

      if (sort) {
        console.log("okokok");
        const objectSort = {};
        objectSort[sort[1]] = sort[0];
        console.log("objectSort", objectSort);
        const allProductSort = await Product.find()
          .limit(limit)
          .skip(page * limit)
          .sort(objectSort);

        resolve({
          status: "OK",
          message: "All product Successfully",
          data: allProductSort,
          total: totalProduct,
          pageCurrent: Number(page + 1),
          totalPage: Math.ceil(totalProduct / limit),
        });
      }

      const allProduct = await Product.find()
        .limit(limit)
        .skip(page * limit);

      resolve({
        status: "OK",
        message: "All product Successfully",
        data: allProduct,
        total: totalProduct,
        pageCurrent: Number(page + 1),
        totalPage: Math.ceil(totalProduct / limit),
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllType = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allType = await Product.distinct("type");

      resolve({
        status: "OK",
        message: "All type product Successfully",
        data: allType,
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
  deleteManyProduct,
  getAllType,
};

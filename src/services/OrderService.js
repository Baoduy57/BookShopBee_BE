const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");

// tao doi tuong moi
// const createOrder = (newOrder) => {
//   return new Promise(async (resolve, reject) => {
//     const {
//       orderItems,
//       paymentMethod,
//       itemsPrice,
//       shippingPrice,
//       totalPrice,
//       fullName,
//       address,
//       city,
//       phone,
//       user, // Thêm user vào đây
//     } = newOrder;
//     try {
//       const promises = orderItems.map(async (order) => {
//         const productData = await Product.findOneAndUpdate(
//           {
//             _id: order.product,
//             countInStock: { $gte: order.amount },
//           },
//           {
//             $inc: {
//               countInStock: -order.amount,
//               selled: +order.amount,
//             },
//           },
//           { new: true }
//         );
//         if (productData) {
//           const createdOrder = await Order.create({
//             orderItems,
//             shippingAddress: {
//               fullName,
//               address,
//               city,
//               phone,
//             },
//             paymentMethod,
//             itemsPrice,
//             shippingPrice,
//             totalPrice,
//             user: user,
//           });
//           if (createdOrder) {
//             return {
//               status: "OK",
//               message: "Create order successfully",
//             };
//           }
//         } else {
//           return {
//             status: "OK",
//             message: "ERR",
//             id: order.product,
//           };
//         }
//       });
//       const results = await Promise.all(promises);
//       const newData = results && results.filter((item) => item.id);
//       if (newData.length) {
//         resolve({
//           status: "ERR",
//           message: `San pham voi id${newData.join(", ")} khong du hang`,
//         });
//       }
//       resolve({
//         status: "OK",
//         message: "Order successful",
//       });
//     } catch (e) {
//       reject(e);
//     }
//   });
// };

const createOrder = (newOrder) => {
  return new Promise(async (resolve, reject) => {
    const {
      orderItems,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      fullName,
      address,
      city,
      phone,
      user,
    } = newOrder;

    try {
      // Duyệt qua từng sản phẩm để cập nhật kho hàng
      const promises = orderItems.map(async (order) => {
        const productData = await Product.findOneAndUpdate(
          {
            _id: order.product,
            countInStock: { $gte: order.amount },
          },
          {
            $inc: {
              countInStock: -order.amount,
              selled: +order.amount,
            },
          },
          { new: true }
        );
        if (!productData) {
          return {
            status: "ERR",
            id: order.product,
          };
        }
      });

      // Đợi tất cả các sản phẩm được cập nhật
      const results = await Promise.all(promises);
      const newData =
        results && results.filter((item) => item && item.status === "ERR");

      if (newData.length) {
        resolve({
          status: "ERR",
          message: `Sản phẩm với id ${newData
            .map((item) => item.id)
            .join(", ")} không đủ hàng`,
        });
        return;
      }

      // Sau khi cập nhật kho, tạo đơn hàng duy nhất
      const createdOrder = await Order.create({
        orderItems,
        shippingAddress: {
          fullName,
          address,
          city,
          phone,
        },
        paymentMethod,
        itemsPrice,
        shippingPrice,
        totalPrice,
        user: user,
      });

      if (createdOrder) {
        resolve({
          status: "OK",
          message: "Create order successfully",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getAllOrderDetails = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.find({
        user: id,
      });

      if (order === null) {
        resolve({
          status: "ERR",
          message: "The order does not exist",
        });
      }

      resolve({
        status: "OK",
        message: "Details Product Successfully",
        data: order,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailsOrder = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.findById({
        _id: id,
      });

      if (order === null) {
        resolve({
          status: "ERR",
          message: "The order does not exist",
        });
      }

      resolve({
        status: "OK",
        message: "Details Order Successfully",
        data: order,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const cancelDetailsOrder = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let order = [];
      const promises = data.map(async (order) => {
        const productData = await Product.findOneAndUpdate(
          {
            _id: order.product,
            selled: { $gte: order.amount },
          },
          {
            $inc: {
              countInStock: +order.amount,
              selled: -order.amount,
            },
          },
          { new: true }
        );
        if (productData) {
          order = await Order.findByIdAndDelete(id);
          if (order === null) {
            resolve({
              status: "ERR",
              message: "The order does not exist",
            });
          }
        } else {
          return {
            status: "OK",
            message: "ERR",
            id: order.product,
          };
        }
      });
      const results = await Promise.all(promises);
      const newData = results && results.filter((item) => item.id);
      if (newData.length) {
        resolve({
          status: "ERR",
          message: `San pham voi id${newData.join(", ")} khong ton tai`,
        });
      }
      resolve({
        status: "SUCCESS",
        message: "Order cancel successful",
        data: order,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createOrder,
  getAllOrderDetails,
  getDetailsOrder,
  cancelDetailsOrder,
};

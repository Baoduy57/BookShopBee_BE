const Order = require("../models/OrderModel");

// tao doi tuong moi
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
      user, // Thêm user vào đây
    } = newOrder;
    try {
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
          data: createdOrder,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createOrder,
};

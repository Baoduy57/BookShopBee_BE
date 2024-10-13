const OrderService = require("../services/OrderService");

const createOrder = async (req, res) => {
  try {
    const {
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      fullName,
      address,
      city,
      phone,
    } = req.body;

    if (
      !paymentMethod ||
      !itemsPrice ||
      !shippingPrice ||
      !totalPrice ||
      !fullName ||
      !address ||
      !city ||
      !phone
    ) {
      return res.status(400).json({
        status: "ERR",
        message: "The input is required",
      });
    }

    // Gọi service để tạo sản phẩm
    const response = await OrderService.createOrder(req.body);

    return res.status(200).json(response);
  } catch (e) {
    // Xử lý ngoại lệ từ service
    return res.status(500).json({
      status: "ERR",
      message: "Server error: " + e.message,
    });
  }
};

module.exports = {
  createOrder,
};

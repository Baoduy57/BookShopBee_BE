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
    const response = await OrderService.createOrder({
      ...req.body,
      user: req.user.id,
    });

    return res.status(200).json(response);
  } catch (e) {
    // Xử lý ngoại lệ từ service
    return res.status(500).json({
      status: "ERR",
      message: "Server error: " + e.message,
    });
  }
};

const getAllOrderDetails = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({
        status: "ERR",
        message: "userId is not exist",
      });
    }

    const respone = await OrderService.getAllOrderDetails(userId);

    return res.status(200).json(respone);
  } catch (e) {
    return res.status(500).json({
      message: e,
    });
  }
};

const getDetailsOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    if (!orderId) {
      return res.status(400).json({
        status: "ERR",
        message: "orderId is not exist",
      });
    }

    const respone = await OrderService.getDetailsOrder(orderId);

    return res.status(200).json(respone);
  } catch (e) {
    return res.status(500).json({
      message: e,
    });
  }
};

const cancelDetailsOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const data = req.body;
    if (!orderId) {
      return res.status(400).json({
        status: "ERR",
        message: "orderId is not exist",
      });
    }

    const response = await OrderService.cancelDetailsOrder(orderId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e,
    });
  }
};

module.exports = {
  createOrder,
  getAllOrderDetails,
  getDetailsOrder,
  cancelDetailsOrder,
};

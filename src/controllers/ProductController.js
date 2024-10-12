const ProductService = require("../services/ProductService");

// tao product

const createProduct = async (req, res) => {
  try {
    const {
      name,
      image,
      type,
      price,
      countInStock,
      rating,
      description,
      discount,
    } = req.body;

    if (
      !name ||
      !image ||
      !type ||
      !price ||
      !countInStock ||
      !rating ||
      !description ||
      !discount
    ) {
      return res.status(400).json({
        status: "ERR",
        message: "The input is required",
      });
    }

    // Gọi service để tạo sản phẩm
    const response = await ProductService.createProduct(req.body);

    return res.status(200).json(response);
  } catch (e) {
    // Xử lý ngoại lệ từ service
    return res.status(500).json({
      status: "ERR",
      message: "Server error: " + e.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const data = req.body;
    if (!productId) {
      return res.status(200).json({
        status: "ERR",
        message: "Product ID is not exist",
      });
    }
    // console.log("userId: ", userId);
    // console.log("data", data);
    const respone = await ProductService.updateProduct(productId, data);
    return res.status(200).json(respone);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getDetailProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!productId) {
      return res.status(400).json({
        status: "ERR",
        message: "product Id is not exist",
      });
    }

    const respone = await ProductService.getDetailProduct(productId);
    // Kiểm tra nếu sản phẩm không tồn tại
    if (respone.data === null) {
      return res.status(404).json({
        status: "ERR",
        message: "The productID does not exist",
      });
    }

    return res.status(200).json(respone);
  } catch (e) {
    return res.status(500).json({
      message: e,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!productId) {
      return res.status(200).json({
        status: "ERR",
        message: "product Id is not exist",
      });
    }

    const respone = await ProductService.deleteProduct(productId);
    return res.status(200).json(respone);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteManyProduct = async (req, res) => {
  try {
    const ids = req.body.ids;

    if (!ids) {
      return res.status(200).json({
        status: "ERR",
        message: "product Ids is not exist",
      });
    }

    const respone = await ProductService.deleteManyProduct(ids);
    return res.status(200).json(respone);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const { limit, page, sort, filter } = req.query;
    const respone = await ProductService.getAllProduct(
      Number(limit) || null,
      Number(page) || 0,
      sort,
      filter
    );
    return res.status(200).json(respone);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllType = async (req, res) => {
  try {
    const respone = await ProductService.getAllType();
    return res.status(200).json(respone);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
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

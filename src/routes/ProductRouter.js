const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController");
const { authMiddleWare } = require("../middleware/authMiddleWare");

router.post("/Create-Product", ProductController.createProduct);
router.put(
  "/Update-Product/:id",
  authMiddleWare,
  ProductController.updateProduct
);
router.get("/Details-Product/:id", ProductController.getDetailProduct);
router.delete(
  "/Delete-Product/:id",
  authMiddleWare,
  ProductController.deleteProduct
);
router.get("/GetAll-Product/", ProductController.getAllProduct);

module.exports = router;

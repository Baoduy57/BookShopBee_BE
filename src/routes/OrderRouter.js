const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController");
const { authUserMiddleWare } = require("../middleware/authMiddleWare");
const { authMiddleWare } = require("../middleware/authMiddleWare");

router.post("/Create-Order", authUserMiddleWare, OrderController.createOrder);
router.get(
  "/Get-All-Order/:id",
  authUserMiddleWare,
  OrderController.getAllOrderDetails
);
router.get(
  "/Get-Details-Order/:id",
  authUserMiddleWare,
  OrderController.getDetailsOrder
);
router.delete(
  "/Cancel-Order/:id",
  authUserMiddleWare,
  OrderController.cancelDetailsOrder
);
router.get("/Get-AllOrder", authMiddleWare, OrderController.getAllOrder);

module.exports = router;

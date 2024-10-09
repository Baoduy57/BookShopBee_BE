const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
const {
  authMiddleWare,
  authUserMiddleWare,
} = require("../middleware/authMiddleWare");

router.post("/Sign-Up", userController.createUser);
router.post("/Sign-In", userController.loginUser);
router.post("/Log-Out", userController.logoutUser);
router.put("/Update-User/:id", authUserMiddleWare, userController.updateUser);
router.delete("/Delete-User/:id", authMiddleWare, userController.deleteUser);
router.get("/GetAll", authMiddleWare, userController.getAllUser);
router.get(
  "/Get-Details/:id",
  authUserMiddleWare,
  userController.getDetailsUser
);
router.post("/Refresh-Token", userController.refreshToken);
router.post("/Delete-Many/", authMiddleWare, userController.deleteManyUser);

module.exports = router;

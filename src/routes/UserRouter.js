const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
const { authMiddleWare } = require("../middleware/authMiddleWare");

router.post("/Sign-Up", userController.createUser);
router.post("/Sign-In", userController.loginUser);
router.put("/Update-User/:id", userController.updateUser);
router.delete("/Delete-User/:id", authMiddleWare, userController.deleteUser);
router.get("/GetAll", authMiddleWare, userController.getAllUser);
router.get("/Get-Details/:id", userController.getDetailsUser);

module.exports = router;

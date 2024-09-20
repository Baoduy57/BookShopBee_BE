const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");

router.post("/Sign-Up", userController.createUser);
router.post("/Sign-In", userController.loginUser);
router.put("/Update-User/:id", userController.updateUser);

module.exports = router;

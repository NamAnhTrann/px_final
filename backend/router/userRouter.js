const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

router.get("/list/all/user", userController.getUserDetail);
router.get("/get/user/:id", userController.getSpecificUser);
router.put("/update/user/:id", userController.updateUserApi);

module.exports = router;

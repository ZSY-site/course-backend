const express = require("express");
const router = express.Router();

const UserController = require("../controller/UserController.js");

// 注册接口
router.post("/register", UserController.register);

// 设置密码接口（其实就是注册时可以点击忘记密码那里）
router.post("/forget", UserController.forget);

// 账号密码方式登录
router.post("/login", UserController.login);

// 用户详情信息接口
router.get("/detail", UserController.detail);

module.exports = router;
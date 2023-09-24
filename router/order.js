const express = require("express");
const router = express.Router();

const OrderController = require("../controller/OrderController.js");

// 查询课程是否已购买
router.get("/register", OrderController.query_pay);

// 查询课程最近购买动态接口
router.get("/latest", OrderController.latest);

module.exports = router;
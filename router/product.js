const express = require("express");
const router = express.Router();

const ProductController = require("../controller/ProductController.js");

// 课程分类接口
router.get("/category", ProductController.category);

// 视频卡片
router.get("/card", ProductController.card);

// 视频详情接口
router.post("/detail", ProductController.detail);

// 某个课程视频章集接口
router.get("/chapter", ProductController.chapter);

// 课程资料接口
router.get("/material_by_id", ProductController.material_by_id);

module.exports = router;
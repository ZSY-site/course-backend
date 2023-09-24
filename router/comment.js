const express = require("express");
const router = express.Router();

const CommentController = require("../controller/CommentController.js");

// 用户评论列表接口
router.post("/page", CommentController.page);

module.exports = router;
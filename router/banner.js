const express = require("express");
const router = express.Router();

const BannerController = require("../controller/BannerController.js");

// Banner 图
router.get("/list", BannerController.list);

module.exports = router;
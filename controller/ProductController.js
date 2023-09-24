const ProductService = require("../service/ProductService.js");

const ProductController = {
    // 课程分类接口
    category: async (req, res) => {
        let handleRes = await ProductService.category();
        res.send(handleRes);
    },

    // 视频卡片
    card: async (req, res) => {
        let handleRes = await ProductService.card();
        res.send(handleRes);
    },

    // 视频详情接口
    detail: async (req, res) => {
        let handleRes = await ProductService.detail(req);
        res.send(handleRes);
    },

    // 某个课程视频章集接口
    chapter: async (req, res) => {
        let handleRes = await ProductService.chapter(req);
        res.send(handleRes);
    },

    // 课程资料接口
    material_by_id: async (req, res) => {
        let handleRes = await ProductService.material_by_id(req);
        res.send(handleRes);
    },
};

module.exports = ProductController;
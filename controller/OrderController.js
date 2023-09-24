const OrderService = require("../service/OrderService");

const OrderController = {
    query_pay: async (req, res) => {
        let handleRes = await OrderService.query_pay(req);
        res.send(handleRes);
    },

    // 查询课程最近购买动态
    latest: async (req, res) => {
        let handleRes = await OrderService.latest(req);
        res.send(handleRes);
    },
};

module.exports = OrderController;
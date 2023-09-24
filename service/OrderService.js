const DB = require('../config/sequelize')
const BackCode = require('../utils/BackCode')
const SecretTool = require('../utils/SecretTool')
const CodeEnum = require('../utils/CodeEnum')

const OrderService = {
    // 查询课程是否已购买
    query_pay: async (req) => {
        // 课程 id
        let {
            id
        } = req.query;

        // 获取用户 token
        let token = req.headers.authorization.split(" ").pop();
        let userInfo = SecretTool.jwtVerify(token);
        let orderList = await DB.ProductOrder.findAll({
            where: {
                product_id: id,
                account_id: userInfo.id,
                order_state: "PAY"
            },
            raw: true,
        });
        if (orderList.length > 0) {
            if (orderList[0].order_state === "PAY") {
                return JsonData.buildSuccess();
            }
        } else {
            return BackCode.buildError(CodeEnum.PRODUCT_NOT_PAY);
        }
    },

    // 查询课程最近购买动态
    latest: async (req) => {
        let {
            id
        } = req.query;
        let latestList = await DB.ProductOrder.findAll({
            where: {
                product_id: id
            },
            order: [
                ["gmt_create", "DESC"]
            ],
            limit: 20,
        });
        return BackCode.buildSuccessAndData(latestList);
    }
};

module.exports = OrderService
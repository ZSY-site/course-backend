const DB = require("../config/sequelize");
const BackCode = require('../utils/BackCode')
const SecretTool = require('../utils/SecretTool')
const CodeEnum = require('../utils/CodeEnum')

const ProductService = {
    category: async () => {
        let categoryList = await DB.Category.findAll({
            where: {
                pid: 0
            },
            include: [{
                model: DB.Category,
                as: "subCategoryList"
            }],
        });
        return BackCode.buildSuccessAndData(categoryList);
    },

    // 视频卡片
    card: async (req, res) => {
        let cardList = await DB.ProductCard.findAll({
            raw: true
        });
        let list = cardList.map(async (item) => {
            item.product_list = await DB.Product.findAll({
                where: {
                    id: item.product_list.split(",")
                },
                raw: true,
            });
            return item;
        });

        // 处理返回的每项 promise
        let lastList = await Promise.all(list);
        return BackCode.buildSuccessAndData(lastList);
    },

    detail: async (req) => {
        let {
            id
        } = req.query;
        let productDetail = await DB.Product.findOne({
            where: {
                id
            },

            /**
             * 1. 课程表需要关联查询教师表，因此需要去【根目录\config\sequelize.js】定义下关联关系
             * 2. 通过 include 实现关联关系
             */
            include: [{
                model: DB.Teacher,
                as: "teacherDetail"
            }],

            // 注意：此处我们不能设置【raw: true】,因为我们上面使用关联查询
        });

        return BackCode.buildSuccessAndData({
            data: {
                ...productDetail.toJSON(),
                bd_zip_url: "",
                note_url: ""
            },
        });
    },

    // 某个课程视频章集接口
    chapter: async (req) => {
        // 课程（大课）id
        let {
            id
        } = req.query;

        /**
         * 1. 课程下有多个章节
         * 2. 章节下有多个小节
         */

        // 章节列表
        let chapterList = await DB.Chapter.findAll({
            where: {
                product_id: id
            },
            order: [
                ["ordered"]
            ],
            raw: true,
        });

        // 小节列表
        let episodeList = await DB.Episode.findAll({
            where: {
                product_id: id
            },
            order: [
                ["ordered"]
            ],
            raw: true,
        });

        // 将课程的集生成对象数组插入到章的每一项当中
        chapterList.map((item) => {
            item["episodeList"] = [];
            episodeList.map((subItem) => {
                if (item.id === subItem.chapter_id) {
                    return item["episodeList"].push(subItem);
                }
            });
        });

        return BackCode.buildSuccessAndData(chapterList);
    },

    // 课程资料接口
    material_by_id: async (req) => {
        // 课程（大课）id
        let {
            id
        } = req.query;
        let token = req.headers.authorization.split(" ").pop();

        // 判断是否登录
        if (!token) {
            return BackCode.buildResult(CodeEnum.ACCOUNT_UNLOGIN);
        }
        let userInfo = SecretTool.jwtVerify(token);

        // 判断是否购买, 如果没有购买过是不会展示课程相关信息给用户的
        let orderList = await DB.ProductOrder.findAll({
            where: {
                product_id: id,
                account_id: userInfo.id,
                order_state: "PAY"
            },
            raw: true,
        });
        if (orderList.length > 0) {
            let productDetail = await DB.Product.findOne({
                attributes: ["bd_zip_url", "note_url"],
                where: {
                    id
                },
            });
            return BackCode.buildSuccessAndData({
                data: productDetail
            });
        } else {
            return BackCode.buildError(CodeEnum.PRODUCT_NO_PAY);
        }
    }
}

module.exports = ProductService;
const DB = require("../config/sequelize");
const BackCode = require("../utils/BackCode");

const CommentService = {
    page: async (req) => {
        let {
            page,
            size,
            id
        } = req.body;

        if (!(page && size && id)) {
            // 只要有一个参数没有传，就直接抛出错误
            return BackCode.buildError({
                msg: "缺少必要的参数"
            });
        }

        // findAndCountAll 整合了 findAll 和 count 两个方法，一般在分页的时候非常适用
        let {
            count,
            rows
        } = await DB.Comment.findAndCountAll({
            where: {
                product_id: id
            },
            order: [
                ["gmt_create", "DESC"]
            ],
            offset: Number((page - 1) * size),
            limit: Number(size),
        });
        let total_page = null;
        count / size == 0 ?
            (total_page = count / size) :
            (total_page = Math.ceil(count / size));
        return BackCode.buildSuccessAndData({
            current_data: rows,
            total_page: total_page,
            total_record: count,
        });
    },
};

module.exports = CommentService;
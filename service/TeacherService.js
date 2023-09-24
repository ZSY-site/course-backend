const DB = require('../config/sequelize')
const BackCode = require('../utils/BackCode')

const TeacherService = {
    list: async () => {
        const list = await DB.Teacher.findAll();
        return BackCode.buildSuccessAndData({
            data: list
        });
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
}

module.exports = TeacherService
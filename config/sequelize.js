const {
    Sequelize
} = require("sequelize");
const initModels = require("../models/init-models");

const sequelize = new Sequelize("xdclass-edu", "root", "ADMIN123", {
    host: "8.134.130.203", // 此处是阿里云服务器公网IP
    dialect: "mysql",
});

// 测试连接
(async function () {
    try {
        await sequelize.authenticate();
        console.log("数据库链接成功");
    } catch (error) {
        console.error("数据库链接失败:", error);
    }
})();

const models = initModels(sequelize);

// category 表与自身的一对多关系模型
models.Category.hasMany(models.Category, {
    foreignKey: "pid",
    as: "subCategoryList",
});
models.Category.belongsTo(models.Category, {
    foreignKey: "pid",
});


// teacher 表和 product 表的一对多关联查询
models.Teacher.hasMany(models.Product, {
    foreignKey: "teacher_id",
});
models.Product.belongsTo(models.Teacher, {
    foreignKey: "teacher_id",
    as: "teacherDetail",
});

module.exports = {
    ...models,
    sequelize
};
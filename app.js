const express = require("express");
const app = express();
const cors = require("cors");
const DB = require("./config/sequelize");
const {
    expressjwt: jwt
} = require("express-jwt");
const {
    jwtSecretKey
} = require('./config/jwtSecretKey')

// post 请求解析 urlencoded 字符数据格式和 json 数据格式
const bodyParser = require("body-parser");

// 跨域设置
app.use(cors());

// algorithms: ["HS256"] 是一种加密算法
app.use(
    jwt({
        secret: jwtSecretKey,
        algorithms: ["HS256"]
    }).unless({
        // 以下这种接口路径是不需要 token 的
        path: [
            /^\/api\/user\/v1\/register/, // 注册
            /^\/api\/user\/v1\/login/, // 登录
            /^\/api\/user\/v1\/forget/, // 设置密码（即注册界面用户可点击忘记密码）
            /^\/api\/notify\/v1/, // 验证码
            /^\/api\/banner\/v1\/list/, // banner 图
            /^\/api\/product\/v1\/category/, // 课程分类
            /^\/api\/product\/v1\/card/, // 视频卡片
            /^\/api\/teacher\/v1\/list/, // 讲师列表
            /^\/api\/product\/v1\/detail/, // 讲师列表
            /^\/api\/order\/v1\/latest/, // 学员购买动态
            /^\/api\/product\/v1\/chapter/, // 课程视频章集
            /^\/api\/product\/v1\/material_by_id/, // 课程资料
            /^\/api\/comment\/v1\/page/, // 课程评论
            /^\/api\/wx_login\/v1\/callback/, // 微信服务器回调
            /^\/api\/barrage\/v1\/list_by_episode/, // 获取集弹幕
        ],
    })
);

// 解析前端传来的 json 数据格式
app.use(bodyParser.json());

// 解析前端传来的 urlencoded 字符数据格式
// false：返回的对象属性值为 string 或者 array
// true：任何类型
app.use(bodyParser.urlencoded({
    extended: false
}));

// 通知相关的接口
const notifyRouter = require("./router/notify.js");
app.use("/api/notify/v1", notifyRouter);

// 用户相关的接口
const userRouter = require("./router/user.js");
app.use("/api/user/v1", userRouter);

// banner 图相关的接口
const bannerRouter = require("./router/banner.js");
app.use("/api/banner/v1", bannerRouter);

// 视频课程接口
const productRouter = require("./router/product.js");
app.use("/api/product/v1", productRouter);

// 讲师相关接口
const teacherRouter = require("./router/teacher");
app.use("/api/teacher/v1", teacherRouter);

// 订单相关的接口
const orderRouter = require("./router/order");
app.use("/api/order/v1", orderRouter);

// 评论相关的接口
const commentRouter = require("./router/comment");
app.use("/api/comment/v1", commentRouter);

// 因为对于微信登录，需要有调用微信服务器、前端轮询等多个接口，所以我们这里一个路由模块进行维护
const wxLoginRouter = require("./router/wxLogin.js");
app.use("/api/wx_login/v1", wxLoginRouter);


// 弹幕相关的接口
const barrageController = require("./router/barrage");
app.use("/api/barrage/v1", barrageController);

// 错误中间件
app.use((err, req, res, next) => {
    if (err.name === "UnauthorizedError") {
        return res.send({
            code: -1,
            data: null,
            msg: "请先登录！"
        });
    }

    //其他的错误
    res.send({
        code: -1,
        data: null,
        msg: err.message
    });
});

app.listen(8081, () => {
    console.log("服务启动在：http://127.0.0.1:8081");
});
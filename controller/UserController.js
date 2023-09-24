const UserService = require("../service/UserService");

const UserController = {
    // 用户注册
    register: async (req, res) => {
        let {
            phone,
            code
        } = req.body;
        let handleRes = await UserService.register(phone, code);
        res.send(handleRes);
    },

    // 设置密码接口（其实就是注册时可以点击忘记密码那里）
    forget: async (req, res) => {
        const handleRes = await UserService.forget(req);
        res.send(handleRes);
    },

    // 账号密码方式登录
    login: async (req, res) => {
        let handleRes = await UserService.login(req);
        res.send(handleRes);
    },
    
    // 用户详情信息接口
    detail: async (req, res) => {
        let handleRes = await UserService.detail(req);
        res.send(handleRes);
    },
};

module.exports = UserController
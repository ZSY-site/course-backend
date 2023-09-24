const RandomTool = require("../utils/RandomTool");
const DB = require("../config/sequelize");
const redisConfig = require('../config/redisConfig')
const SecretTool = require('../utils/SecretTool')
const BackCode = require('../utils/BackCode')
const CodeEnum = require('../utils/CodeEnum')

const UserService = {
    register: async (phone, code) => {
        if (!(phone && code)) return BackCode.buildError("缺少必要参数");
        // 第一步: 手机号注册查重的逻辑
        let existPhone = await DB.Account.findAll({
            where: {
                phone
            }
        });
        if (existPhone.length > 0) {
            return {
                code: -1,
                msg: "手机已注册"
            };
        }

        // 第二步：获取 Redis 缓存的 code, 判断用户code 是否正确
        if (await redisConfig.exists("register:code:" + phone)) {
            let codeRes = (await redisConfig.get("register:code:" + phone)).split("_")[1];
            // 对比用户 code 和 Redis code
            if (!(code == codeRes)) {
                return {
                    code: -1,
                    msg: "手机验证码不正确"
                };
            }
        } else {
            return {
                code: -1,
                msg: "请先获取验证码"
            };
        }

        // 第三步: 随机生成用户信息，如随机获取头像、用户名
        let avatar = RandomTool.randomAvatar();
        let username = RandomTool.randomName();

        // 第四步: 加密生成 token 7 天过期
        let user = {
            avatar,
            username,
            phone
        };
        let token = SecretTool.jwtSign(user, "168h");

        // 第五步：用户信息插入数据库
        await DB.Account.create({
            username,
            phone,
            head_img: avatar
        });

        return {
            code: 0,
            data: `Bearer ${token}`
        };
    },

    forget: async (req) => {
        // code 为手机验证码
        let {
            phone,
            password,
            code
        } = req.body;
        // 判断 code 在 redis 中是否存在
        let codeExist = await redisConfig.exists("change:code:" + phone);
        if (!codeExist) return BackCode.buildError({
            msg: "请先获取手机验证码"
        });
        // 判断 redis 中 code 和用户 code 是否相等
        let codeRes = (await redisConfig.get("change:code:" + phone)).split("_")[1];
        if (!(code === codeRes))
            return BackCode.buildError({
                msg: "手机验证码不正确"
            });

        // 对密码进行加密
        pwd = SecretTool.md5(password);
        await DB.Account.update({
            pwd
        }, {
            where: {
                phone
            }
        });
        return BackCode.buildSuccessAndMsg({
            msg: "密码修改成功"
        })
    },
    login: async (req) => {
        let {
            phone,
            password,
            code
        } = req.body;

        // 注意：code 和 password 必须要有其实一个
        if (!(phone && (password || code)))
            return BackCode.buildError("缺少必要参数");
        let userInfo = await DB.Account.findAll({
            where: {
                phone
            },
            raw: true
        });
        if (userInfo.length === 0)
            return BackCode.buildResult(CodeEnum.ACCOUNT_UNREGISTER);

        // 账号密码登录
        if (password) {
            // 判断密码是否正确
            if (!(SecretTool.md5(password) == userInfo[0].pwd)) {
                return BackCode.buildResult(CodeEnum.ACCOUNT_PWD_ERROR);
            }
        } else {
            // 手机验证码登录
            // 获取 redis 缓存的 code, 判断用户 code是否正确
            let codeExist = await redisConfig.exists("login:code:" + phone);
            if (!codeExist) return BackCode.buildError("请先获取手机验证码");
            let codeRes = (await redisConfig.get("login:code:" + phone)).split("_")[1];
            // 对比用户 code 和 Redis code
            if (!(code == codeRes)) return BackCode.buildError("手机验证码不正确");
        }
        // 拼接 token 的用户信息,除去密码
        let user = {
            ...userInfo[0],
            pwd: ""
        };

        // 生成token
        let token = SecretTool.jwtSign(user, "168h");
        return BackCode.buildSuccessAndData(`Bearer ${token}`);
    },

    detail: async (req) => {
        let token = req.headers.authorization.split(" ").pop();
        let userInfo = SecretTool.jwtVerify(token);
        let userDetail = await DB.Account.findOne({
            where: {
                id: userInfo.id,
            },
            raw: true,
        });
        return BackCode.buildSuccessAndData({
            data: {
                ...userDetail,
                pwd: "",
            },
        });
    },
};

module.exports = UserService
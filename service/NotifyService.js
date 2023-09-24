// 引入 redisConfig
const redisConfig = require("../config/redisConfig");
const svgCaptcha = require('svg-captcha')
const sendMsgCode = require('../config/aliyunMessage.js')

const NotifyService = {
    captcha: async (key, type) => {
        let captcha = svgCaptcha.create({
            size: 4, // 验证码长度
            ignoreChars: "0o1i", // 验证码字符中排除 0o1i
            noise: 1, // 干扰线
            background: "#aaa", // 背景颜色
        });

        // 下面的 600 是有效时间，单位为秒
        redisConfig.set(`${type}:captcha:${key}`, captcha.text, 600);

        return captcha.data;
    },

    sendCode: async (phone, captcha, type, key, randomCode) => {
        // ===================== 方案2：这是新的方案 =====================
        if (await redisConfig.exists(`${type}:code:` + phone)) {
            let dateRedis = dayjs(
                Number((await redisConfig.get(`${type}:code:` + phone)).split("_")[0])
            );
            if (dayjs(Date.now()).diff(dateRedis, "second") <= 60) {
                return {
                    code: -1,
                    msg: "60 秒内不能重复获取"
                };
            }
        }

        // 判断是否有图形验证码
        if (!(await redisConfig.exists(`${type}:captcha:` + key))) {
            return {
                code: -1,
                msg: "请发送图形验证码"
            };
        }

        // 对比前端传来的和 Redis 中的图形验证码（忽略大小写）
        let captchaRedis = await redisConfig.get(`${type}:captcha:` + key);
        if (!(captcha.toLowerCase() === captchaRedis.toLowerCase())) {
            return {
                code: -1,
                msg: "图形验证码错误"
            };
        }

        // 调用阿里云发送手机验证码
        let codeRes = (await sendMsgCode(phone, randomCode)).data;


        // ======================= 方案2：这是新的方案 ====================
        // 获取当前时间拼接验证码
        let randomCodeTime = `${Date.now()}_${randomCode}`;
        redisConfig.set(`${type}:code:` + phone, randomCodeTime, 600);


        // 获取手机验证码后删除图形验证码 key 值, 避免 Redis 内存空间
        redisConfig.del(`${type}:captcha:` + key);

        if (codeRes.code == "200") {
            return {
                code: 0,
                msg: "发送成功"
            };
        } else {
            return {
                code: -1,
                msg: "请求失败"
            };
        }
    }
};

module.exports = NotifyService
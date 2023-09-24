const WxLoginService = require("../service/WxLoginService");

const WxLoginController = {
    // 验证微信接入
    wechat_insert: async (req, res) => {
        console.log('xxxxxxxxxxxxx')

        /**
         * 1. 微信服务器会给我们提供下面的参数，我们可以从 req.query 中拿到
         * 2. 这个参数是用于什么对称加密的
         */
        let {
            signature,
            timestamp,
            nonce,
            echostr
        } = req.query;
        let handleRes = await WxLoginService.wechat_insert(
            signature,
            timestamp,
            nonce,
            echostr
        );
        res.send(handleRes);
    },
};

module.exports = WxLoginController;
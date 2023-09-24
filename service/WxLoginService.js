const WxLoginService = {
    wechat_insert: (signature, timestamp, nonce, echostr) => {
        // 下面的操作就是接入微信的文档介绍的流程

        return 'xxxxx'

        // 服务器的 token，这个 token 值任意
        let token = "testxdclass";

        /**
         * 1. 将 token、timestamp、nonce 三个参数进行字典序排序, 拼接成一个字符串, 进行 sha1 加密
         * 2. 字典排序的意思：比如说: b、c、a 那么就会排成 a、b、c
         * 3. 我们下面只要通过 sort() 方法来实现字典排序即可
         */
        let str = SecretTool.sha1([token, timestamp, nonce].sort().join(""));

        /**
         * 1. 获得加密后的字符串可与 signature 对比，验证标识该请求来源于微信服务器
         * 2. signature 是微信服务器传来的
         */
        if (str === signature) {
            // 确认此次 GET 请求来自微信服务器，原样返回echostr 参数内容，则接入生效
            return echostr;
        }
    },
};

module.exports = WxLoginService;
const axios = require("axios");
const AppCode = "b538cd9480794fd0bbf6509b1ffed93e"; // 去阿里云短信平台看

/**
 * 发送短信验证码
 * @param {*} phone 手机号
 * @param {*} randomCode 随机的短信验证码
 * @returns
 */
const sendMsgCode = (phone, randomCode) => {
    return axios({
        method: "post",
        url: `https://jmsms.market.alicloudapi.com/sms/send?mobile=${phone}&templateId=JM1000372&value=${randomCode}`,
        headers: {
            Authorization: "AppCode " + AppCode
        },
    });
};

/**
 * 1. 可以使用下面的代码测试调试发送短信
 * 2. 然后执行: node .\config\aliyunMessage.js
 */
// (async () => {
//   console.log((await sendMsgCode(18826274067, "1234")).data);
// })();

module.exports = sendMsgCode;
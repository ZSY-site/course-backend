const NotifyService = require("../service/NotifyService");

const SecretTool = require("../utils/SecretTool");
const GetUserInfoTool = require("../utils/GetUserInfoTool.js");
const RandomTool = require("../utils/RandomTool");

// 用户的 ip + useragent 进行 md5 加密
const getKey = (req) => {
  return SecretTool.md5(
    GetUserInfoTool.getIp(req) + GetUserInfoTool.getUseragent(req)
  );
};

const NotifyController = {
  captcha: async (req, res) => {
    const _key = getKey(req)
    let {
      type
    } = req.query

    let handleRes = await NotifyService.captcha(_key, type);

    // 设置返回的格式为 svg 图片格式, 如果不设置这个则返回的是一堆乱码
    res.set("content-type", "image/svg+xml");

    res.send(handleRes);
  },

  sendCode: async (req, res) => {
    let {
      phone,
      captcha,
      type
    } = req.body;

    // 用户的 ip + 设备，进行 md5 加密
    let _key = SecretTool.md5(
      GetUserInfoTool.getIp(req) + GetUserInfoTool.getUseragent(req)
    );

    let handleRes = await NotifyService.sendCode(
      phone,
      captcha,
      type,
      _key,
      RandomTool.randomCode()
    );

    res.send(handleRes);
  },
};

module.exports = NotifyController
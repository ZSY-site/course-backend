class GetUserInfoTool {
    // 获取用户 ip 方法
    static getIp(req) {
        let ip = req.ip.match(/\d+.\d+.\d+.\d+/).join("."); // 比如 ip 为：
        return ip;
    }

    // 获取用户设备信息方法
    static getUseragent(req) {
        let useragent = req.headers["user-agent"];
        return useragent;
    }
}

module.exports = GetUserInfoTool;
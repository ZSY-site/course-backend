const Redis = require("ioredis");

const redis = new Redis({
    port: 6379, // 默认的 redis 端口号就是 6379
    host: "8.134.130.203",
    password: "xdclass.net",
});

// 封装 redis 的各个 api 使用
const redisConfig = {
    // 存数据
    set: (key, value, time) => {
        // 有时间就使用时间，否则就是永久储存
        time ? redis.set(key, value, "EX", time) : redis.set(key, value);
    },

    // 获取数据
    get: (key) => {
        // redis.get() 返回一个 promise
        return redis.get(key);
    },

    // 删除数据
    del: (key) => {
        redis.del(key);
    },

    // 判断 key 值是否存在
    exists: (key) => {
        return redis.exists(key);
    },
};

module.exports = redisConfig
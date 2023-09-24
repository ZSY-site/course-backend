const BannerService = require("../service/BannerService");

const BannerController = {
    list: async (req, res) => {
        // 我们根据 location 这个字段来返回不同类型的轮播图，具体我们可以去到 Mysql 数据库中查看 banner 这张表，对于同一种类型的图片，是通过 , 来隔开多张图片的
        let {
            location
        } = req.query;
        console.log('xxx', location)
        let handleRes = await BannerService.list(location);
        res.send(handleRes);
    },
};

module.exports = BannerController;
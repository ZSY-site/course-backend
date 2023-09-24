const SecretTool = require('../utils/SecretTool')
const DB = require('../config/sequelize')
const BackCode = require('../utils/BackCode')
const {
    Op
} = require('sequelize')

const BarrageService = {
    add: async (req) => {
        /**
         * content 弹幕内容
         * episodeId 集 id
         * playTime 用户发送弹幕的时间点
         * productId 课程 id
         */
        let {
            content,
            episodeId,
            playTime,
            productId
        } = req.body;
        if (!(content && episodeId && Number(playTime) >= 0 && productId)) {
            return BackCode.buildError({
                msg: "缺少必要参数"
            });
        }
        let token = req.headers.authorization.split(" ").pop();
        let userInfo = SecretTool.jwtVerify(token);

        // 弹幕相关数据（这条数据会被插入到 `弹幕表`）
        let barrageItem = {
            episode_id: episodeId, // 哪一集的 Id
            product_id: productId, // 课程 Id
            play_time: playTime, // 什么时候发送的弹幕
            content: content, // 弹幕内容
            account_id: userInfo.id, // 用户 Id
            head_img: userInfo.head_img, // 用户头像
            username: userInfo.username, // 用户名
            del: 0, // 记录弹幕是否应该删除，比如那些涉及黄、赌、毒。设置值为 0，即为安全弹幕。
        };
        await DB.BulletScreen.create(barrageItem);
        return BackCode.buildSuccess();
    },

    list_by_episode: async (req) => {
        // 根据前端传来的开始时间和结束时间，从而获取这个时间段的所有弹幕
        let {
            beginTime,
            endTime,
            episodeId,
            productId
        } = req.body;
        if (!(productId && episodeId && Number(beginTime) >= 0 && endTime)) {
            return BackCode.buildError({
                msg: "缺少必要参数"
            });
        }

        // 查询视频指定时间段的所有弹幕
        let barrageList = await DB.BulletScreen.findAll({
            where: {
                play_time: {
                    [Op.between]: [beginTime, endTime]
                },
                episode_id: episodeId,
                product_id: productId,
            },
        });
        return BackCode.buildSuccessAndData({
            data: barrageList
        });
    },
}

module.exports = BarrageService
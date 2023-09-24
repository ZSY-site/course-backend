const BarrageService = require("../service/BarrageService");

const BarrageController = {
    add: async (req, res) => {
        let handleRes = await BarrageService.add(req);
        res.send(handleRes);
    },
    list_by_episode: async (req, res) => {
        let handleRes = await BarrageService.list_by_episode(req);
        res.send(handleRes);
    },
};

module.exports = BarrageController;
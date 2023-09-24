const TeacherService = require("../service/TeacherService");

const TeacherController = {
    list: async (req, res) => {
        let handleRes = await TeacherService.list();
        res.send(handleRes);
    },
};

module.exports = TeacherController;
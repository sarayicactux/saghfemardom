var MyAppModel      = require("../configs/mod-config");

var UserLog = MyAppModel.extend({
    tableName: "userlogs",
});

module.exports = UserLog;
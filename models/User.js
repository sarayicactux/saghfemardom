var MyAppModel      = require("../configs/mod-config");

var User = MyAppModel.extend({
    tableName: "users",
});

module.exports = User;
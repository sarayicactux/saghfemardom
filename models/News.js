var MyAppModel      = require("../configs/mod-config");

var News = MyAppModel.extend({
    tableName: "news",
});

module.exports = News;
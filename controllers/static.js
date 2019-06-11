const path          = require('path');
const url           = require('url');
const date          = require('date-and-time');
var prInj       = require('../helpers/prInj');
var jDate       = require('../helpers/jDate');
var Models      = require('../models/Models');
var User        = require('../models/User');


module.exports = {



    list:function (req,res) {

        Models.StaticContent.findAll({
            order: [
                ['id', 'DESC'],
            ],
            offset:0,
            limit:400,

        })
            .then(function (staticC) {
                res.render('panel/static/list',{staticC:staticC,jDate:jDate});
            })
            .catch(function (err) {
                res.json(err);
            })
    },
    edit:function (req,res) {
        inputs = prInj.PrAll(req.params);
        Models.StaticContent.findByPk(inputs.id)
            .then(function (v) {
                res.render('panel/static/edit',{v:v});
            })
            .catch(function (err) {
                console.log(err);
                res.render('errors/500');
            })
    },
    Update:function (req,res) {
        inputs      = prInj.PrAll(req.body);
        title       = inputs.title;
        description = inputs.description;

        now = new Date();
        var updated_at = date.format(now, 'YYYY-MM-DD HH:mm:ss');


        var UpdateC = {
            title          : title,
            description    : description,
            updated_at     : updated_at,
        };
        var where = {
            where:{id:inputs.id}
        };
        Models.StaticContent.update(UpdateC,
            where)
            .then(function (rowsUpdated) {
                res.json({status:true});return;
            }).catch(function (err) {
            console.log(err);
            res.json({status:false});return;
        })



    },


};
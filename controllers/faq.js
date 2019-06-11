const path          = require('path');
const url           = require('url');
const date          = require('date-and-time');
var prInj       = require('../helpers/prInj');
var jDate       = require('../helpers/jDate');
var Models      = require('../models/Models');
var User        = require('../models/User');


module.exports = {



    add:function (req,res) {

        res.render('panel/faq/add');
    },
    create:function (req,res) {
        inputs      = prInj.PrAll(req.body);

        title       = inputs.title;
        description = inputs.description;
        now = new Date();
        var created_at = date.format(now, 'YYYY-MM-DD HH:mm:ss');

        var faqC = {
            title          : title,
            description    : description,
            created_at     : created_at,
            updated_at     : created_at,
        };

        Models.Faq.create(faqC)
            .then(function (Nnew) {


                res.json({status:true});return;

            })
            .catch(function (err) {
                console.log(err);
                res.json({status:false});return;
            });



    },
    list:function (req,res) {

        Models.Faq.findAll({
            order: [
                ['id', 'DESC'],
            ],
            offset:0,
            limit:400,

        })
            .then(function (faq) {
                res.render('panel/faq/list',{faq:faq,jDate:jDate});
            })
            .catch(function (err) {
                res.json(err);
            })
    },
    changeStatus:function (req,res) {
        inputs = prInj.PrAll(req.body);
        Models.Faq.update({
                active:inputs.status
            },
            {
                where:{id:inputs.id}
            }
        ).then(function () {
            console.log('done');
            res.json('done');
        }).catch(function (err) {
            console.log(err);
            res.json('error');
        })
    },
    edit:function (req,res) {
        inputs = prInj.PrAll(req.params);
        Models.Faq.findByPk(inputs.id)
            .then(function (v) {
                res.render('panel/faq/edit',{v:v});
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
        Models.Faq.update(UpdateC,
            where)
            .then(function (rowsUpdated) {
                res.json({status:true});return;
            }).catch(function (err) {
            console.log(err);
            res.json({status:false});return;
        })



    },


};
const path          = require('path');
const url           = require('url');
const date          = require('date-and-time');
var prInj       = require('../helpers/prInj');
var jDate       = require('../helpers/jDate');
var Models      = require('../models/Models');
var User        = require('../models/User');
var News        = require('../models/News');


module.exports = {



    add:function (req,res) {

        res.render('panel/news/add');
    },
    create:function (req,res) {
        inputs      = prInj.PrAll(req.body);

        summary     = inputs.summary;
        title       = inputs.title;
        text        = inputs.text;
        source      = inputs.source;
        source_link = inputs.source_link;
        thumb       = inputs.image;
        var slug = title;
        slug = slug.replace(/ /g,'-');
        slug = slug.replace(/--/g,'-');
        now = new Date();
        var created_at = date.format(now, 'YYYY-MM-DD HH:mm:ss');

        var newC = {
            slug           : slug,
            title          : title,
            text           : text,
            summary        : summary,
            source         : source,
            source_link    : source_link,
            thumb          : thumb,
            created_at     : created_at,
            updated_at     : created_at,
        };

        Models.News.create(newC)
            .then(function (Nnew) {


                res.json({status:true});return;

            })
            .catch(function (err) {
                console.log(err);
                res.json({status:false});return;
            });



    },
    list:function (req,res) {

        Models.News.findAll({
            order: [
                ['id', 'DESC'],
            ],
            offset:0,
            limit:400,

        })
            .then(function (news) {
                res.render('panel/news/list',{news:news,jDate:jDate});
            })
            .catch(function (err) {
                res.json(err);
            })
    },
    changeStatus:function (req,res) {
        inputs = prInj.PrAll(req.body);
        Models.News.update({
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
        Models.News.findByPk(inputs.id)
            .then(function (v) {
                res.render('panel/news/edit',{v:v});
            })
            .catch(function (err) {
                console.log(err);
                res.render('errors/500');
            })
    },
    Update:function (req,res) {
        inputs      = prInj.PrAll(req.body);
        summary     = inputs.summary;
        title       = inputs.title;
        text        = inputs.text;
        source      = inputs.source;
        source_link = inputs.source_link;
        thumb       = inputs.image;

        now = new Date();
        var updated_at = date.format(now, 'YYYY-MM-DD HH:mm:ss');


        var UpdateC = {
            title          : title,
            text           : text,
            summary        : summary,
            source         : source,
            source_link    : source_link,
            thumb          : thumb,
            updated_at     : updated_at,
        };
        var where = {
            where:{id:inputs.id}
        };
        Models.News.update(UpdateC,
            where)
            .then(function (rowsUpdated) {
                res.json({status:true});return;
            }).catch(function (err) {
            console.log(err);
            res.json({status:false});return;
        })



    },


};
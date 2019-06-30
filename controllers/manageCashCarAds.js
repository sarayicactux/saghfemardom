const path          = require('path');
const url           = require('url');
const date          = require('date-and-time');
const fs            = require('fs');


var prInj   = require('../helpers/prInj');
var needFul = require('../helpers/needFul');
var jDate   = require('../helpers/jDate');
var Models  = require('../models/Models');
var User    = require('../models/User');


module.exports = {

    newList:function (req,res) {
            Models.CarAdv.findAll({
                where:{
                    status : 0,
                    selling_type:1,
                    checked : 0
                },
                include:[
                    Models.Brand1,
                    Models.Car,
                ],
                order:[
                    ['id','DESC']
                ]
            })
                .then(function (advs) {
                        res.render('panel/manageCashCarAds/newsList',{advs:advs,jDate:jDate,needFul});
                })
    },
    accList:function (req,res) {
        Models.CarAdv.findAll({
            where:{
                status : 1,
                selling_type:1,
                checked : 1
            },
            include:[
                Models.Brand1,
                Models.Car,
            ],
            order:[
                ['id','DESC']
            ]
        })
            .then(function (advs) {
                res.render('panel/manageCashCarAds/checkedList',{lsTy:'تایید شده',advs:advs,jDate:jDate,needFul});
            })
    },
    nAccList:function (req,res) {
        Models.CarAdv.findAll({
            where:{
                status : 0,
                selling_type:1,
                checked : 1
            },
            include:[
                Models.Brand1,
                Models.Car,
            ],
            order:[
                ['id','DESC']
            ]
        })
            .then(function (advs) {
                res.render('panel/manageCashCarAds/checkedList',{lsTy:'رد شده',advs:advs,jDate:jDate,needFul});
            })
    },
    det:function (req,res) {
        id = prInj.PrInj(req.params.id);
        Models.CarAdv.findOne({
            where:{
                id : id
            },
            include:[
                Models.Brand1,
                Models.Car,
                Models.CarAdvImage,
                Models.People,
            ]
        })
            .then(function (adv) {
                if(adv.id != undefined){
                    res.render('panel/manageCashCarAds/det',{adv:adv,jDate:jDate,needFul});
                }
                else {
                    res.status(404);
                    res.render('errors/404');
                }

            }).catch(function (e) {
            console.log(e);
            res.status(500);
            res.render('errors/500');
        })
    },
    accAdv:function (req,res) {
            id = prInj.PrInj(req.body.id);
            now = new Date();
            var actived_at = date.format(now, 'YYYY-MM-DD HH:mm:ss');
            Models.CarAdv.update({
                status      : 1,
                checked     : 1,
                actived_at  : actived_at
            },{
                where:{
                    id : id
                }
            })
                .then(function (r) {
                    res.json({status:true});return
                })
                .catch(function (err) {
                    res.status(500);
                    res.json({status:true});return
                })


    },
    nAccAdv:function (req,res) {
        id      = prInj.PrInj(req.body.id);
        reason  = prInj.PrInj(req.body.reason);
        now = new Date();
        var actived_at = date.format(now, 'YYYY-MM-DD HH:mm:ss');
        Models.CarAdv.update({
            status      : 0,
            checked     : 1,
            reason      : reason,
        },{
            where:{
                id : id
            }
        })
            .then(function (r) {
                res.json({status:true});return
            })
            .catch(function (err) {
                res.status(500);
                res.json({status:true});return
            })


    }



};
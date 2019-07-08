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
            Models.Adv.findAll({
                where:{
                    status : 0,
                    checked : 0
                },
                include:[
                    Models.BusinessGr,
                    Models.BusinessType
                ],
                order:[
                    ['id','DESC']
                ]
            })
                .then(function (advs) {
                        res.render('panel/manageAdvs/newsList',{advs:advs,jDate:jDate,needFul});
                })
    },
    accList:function (req,res) {
        Models.Adv.findAll({
            where:{
                status : 1,
                checked : 1
            },
            include:[
                Models.BusinessGr,
                Models.BusinessType
            ],
            order:[
                ['id','DESC']
            ]
        })
            .then(function (advs) {
                res.render('panel/manageAdvs/checkedList',{lsTy:'تایید شده',advs:advs,jDate:jDate,needFul});
            })
    },
    nAccList:function (req,res) {
        Models.Adv.findAll({
            where:{
                status : 0,
                checked : 1
            },
            include:[
                Models.BusinessGr,
                Models.BusinessType
            ],
            order:[
                ['id','DESC']
            ]
        })
            .then(function (advs) {
                res.render('panel/manageAdvs/checkedList',{lsTy:'رد شده',advs:advs,jDate:jDate,needFul});
            })
    },
    det:function (req,res) {
        id = prInj.PrInj(req.params.id);
        Models.Adv.findOne({
            where:{
                id : id
            },
            include:[
                Models.BusinessGr,
                Models.BusinessType,
                Models.AdvImage,
                Models.People,
                Models.Comment
            ]
        })
            .then(function (adv) {
                if(adv.id != undefined){
                    res.render('panel/manageAdvs/det',{adv:adv,jDate:jDate,needFul});
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
            Models.Adv.findOne({
                where:{
                    id : id
                }
            }).then(function (ad) {
                    if(ad.bgRN.length > 8){
                            Models.BusinessGr.findOne({
                                where:{
                                    title:ad.bgRN
                                }
                            })
                                .then(function (bgr) {
                                    if(!bgr){
                                        title        = ad.bgRN;
                                        type_id      = ad.business_type;
                                        description  = ad.bgRN;
                                        slug         = title;
                                        slug         = slug.replace(/ /g,'-');
                                        slug         = slug.replace(/--/g,'-');
                                        Models.BusinessGr.create({
                                            title           :title,
                                            business_type_id:type_id,
                                            slug            :slug,
                                            description     :description,
                                            created_at      : actived_at,
                                            updated_at      : actived_at,
                                        }).then(function (nbg) {
                                            business_gr = nbg.id;
                                            Models.Adv.update({
                                                business_gr : business_gr,
                                                bgRN        : '',
                                                actived_at  : actived_at
                                            },{
                                                where:{
                                                    id : id
                                                }
                                            })

                                        })
                                    }
                                })
                    }
            })

            Models.Adv.update({
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
        Models.Adv.update({
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
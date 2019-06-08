const path          = require('path');
const url           = require('url');
const date          = require('date-and-time');
const fs            = require('fs');


var prInj = require('../helpers/prInj');
var needFul = require('../helpers/needFul');
var jDate = require('../helpers/jDate');
var Models = require('../models/Models');
var User   = require('../models/User');


module.exports = {

    business:function (req,res) {
                inputs = prInj.PrAll(req.params);
                Models.BusinessType.findByPk( inputs.typeId,{
                   include:[
                       Models.BusinessGr
                   ]

                }) .then(function (b) {
                        res.render('panel/business/businesses',{business:b,jDate:jDate});
                }).catch(function (err) {
                    console.log(err);
                    res.render('errors/500');
                })
    },
    createUpdateBgr:function (req,res) {
        inputs = prInj.PrAll(req.body);
        title        = inputs.title;
        type_id      = inputs.type_id;
        description  = inputs.description;
        slug         = title;
        slug         = slug.replace(/ /g,'-');
        slug         = slug.replace(/--/g,'-');
        now = new Date();
        var created_at = date.format(now, 'YYYY-MM-DD HH:mm:ss');
        if(inputs.mid != 'q'){
            Models.BusinessGr.update({
                    'title'        : title,
                    'description'  : description,
                    'slug'         : slug,
                    'updated_at'   : created_at,
                },
                {
                    where:{'id':inputs.mid}
                })
                .then(function (rowsUpdated) {
                    Models.BusinessType.findByPk( type_id,{
                        include:[
                            Models.BusinessGr
                        ]

                    })  .then(function (b) {
                        res.render('panel/business/businessesList',{business:b,jDate:jDate});
                    }).catch(function (err) {
                        console.log(err);
                        res.render('errors/500');
                    })

                })
                .catch(function (err) {
                    res.render('errors/500');
                });
        }
        else {

            Models.BusinessGr.create({
                'title'            : title,
                'business_type_id' : type_id,
                'description'      : description,
                'slug'             : slug,
                'created_at'       : created_at,
                'updated_at'       : created_at,
            })
                .then(function (brand) {
                    Models.BusinessType.findByPk( type_id,{
                        include:[
                            Models.BusinessGr
                        ]

                    }) .then(function (b) {
                        res.render('panel/business/businessesList',{business:b,jDate:jDate});
                    }).catch(function (err) {
                        console.log(err);
                        res.render('errors/500');
                    })
                })
                .catch(function (err) {
                    res.render(err);
                });
        }
    },

};
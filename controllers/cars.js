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

    brands:function (req,res) {
                Models.Brand1.findAll({
                    order:[
                        ['id','desc']
                    ]
                }) .then(function (brands) {
                        res.render('panel/cars/brands',{brands:brands,jDate:jDate});
                }).catch(function (err) {
                    console.log(err);
                    res.render('errors/500');
                })
    },
    createUpdateBrand:function (req,res) {
        inputs = prInj.PrAll(req.body);
        title = inputs.title;
        en_title = inputs.en_title;
        logo  = inputs.logo;
        slug = title;
        slug = slug.replace(/ /g,'-');
        slug = slug.replace(/--/g,'-');
        now = new Date();
        var created_at = date.format(now, 'YYYY-MM-DD HH:mm:ss');
        if(inputs.mid != 'q'){
            Models.Brand1.update({
                    'title'     : title,
                    'en_title'  : en_title,
                    'slug'      : slug,
                    'logo'      : logo,
                    'updated_at': created_at,
                },
                {
                    where:{'id':inputs.mid}
                })
                .then(function (rowsUpdated) {
                    Models.Brand1.findAll({
                        order:[
                            ['id','desc']
                        ]
                    }) .then(function (brands) {
                        res.render('panel/cars/brandsList',{brands:brands,jDate:jDate});
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

            Models.Brand1.create({
                'title'     : title,
                'en_title'  : en_title,
                'slug'      : slug,
                'logo'      : logo,
                'created_at': created_at,
                'updated_at': created_at,
            })
                .then(function (brand) {
                    Models.Brand1.findAll({
                        order:[
                            ['id','desc']
                        ]
                    }) .then(function (brands) {
                        res.render('panel/cars/brandsList',{brands:brands,jDate:jDate});
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
    cars:function (req,res) {

        Models.Car.findAll({
            order:[
                ['id','desc']
            ],
            include:[
                Models.Brand1,
                Models.Brand2,
            ]

        }) .then(function (cars) {
            res.render('panel/cars/cars',{cars:cars,jDate:jDate,needFul});
        }).catch(function (err) {
            console.log(err);
            res.render('errors/500');
        })
    },
    add:function(req,res){
        brands = res.brands;
        res.render('panel/cars/add',{brands : brands});
    },
    update:function(req,res){
        brands = res.brands;
        inputs      = prInj.PrAll(req.params);
        Models.Car.findByPk(inputs.id,{
            include:[
                Models.Brand1,
                Models.Brand2,
                Models.CarImage
            ]
        }).then(function (car) {
            res.render('panel/cars/edit',{brands : brands,car:car});
        })

    },
    createUpdateCar:function (req,res) {
        inputs      = prInj.PrAll(req.body);
        brand1      = inputs.brand1;
        brand2      = inputs.brand2;
        model       = inputs.model;
        tech_spec   = inputs.tech_spec;
        description = inputs.description;
        show_price  = inputs.show_price;
        price       = inputs.price;
        videoPath   = inputs.video;
        slug = model;
        slug = slug.replace(/ /g,'-');
        slug = slug.replace(/--/g,'-');
        now = new Date();
        var created_at = date.format(now, 'YYYY-MM-DD HH:mm:ss');
        if(inputs.mid != 'q'){
            Models.CarImage.destroy({
                where: {
                    'car_id' : inputs.mid
                }
            }).then(function (d) {
                insertCarImage(inputs.mid,inputs.image1,created_at)
                insertCarImage(inputs.mid,inputs.image2,created_at)
                insertCarImage(inputs.mid,inputs.image3,created_at)
                insertCarImage(inputs.mid,inputs.image4,created_at)
            });

            Models.Car.update({
                    'brand1_id'     : brand1,
                    'brand2_id'     : brand2,
                    'model'      : model,
                    'slug'       : slug,
                    'video'      : videoPath,
                    'tech_spec'  : tech_spec,
                    'description': description,
                    'show_price' : show_price,
                    'price'      : price,
                    'updated_at': created_at,
                },
                {
                    where:{'id':inputs.mid}
                })
                .then(function (rowsUpdated) {
                    res.json({status:true});return;

                })
                .catch(function (err) {
                    res.render('errors/500');
                });
        }
        else {

            Models.Car.create({
                'brand1_id'     : brand1,
                'brand2_id'     : brand2,
                'model'      : model,
                'slug'       : slug,
                'tech_spec'  : tech_spec,
                'description': description,
                'show_price' : show_price,
                'price'      : price,
                'video'      : videoPath,
                'created_at' : created_at,
                'updated_at' : created_at,
            })
                .then(function (car) {
                    insertCarImage(car.id,inputs.image1,created_at)
                    insertCarImage(car.id,inputs.image2,created_at)
                    insertCarImage(car.id,inputs.image3,created_at)
                    insertCarImage(car.id,inputs.image4,created_at)
                    res.json({status:true});return;
                })
                .catch(function (err) {
                    res.render(err);
                });
        }
        function insertCarImage(car_id,img_url,created_at) {
            if (img_url.length > 6){
                Models.CarImage.create({
                    'car_id'      : car_id,
                    'img_url'     : img_url,
                    'created_at'  : created_at,
                    'updated_at'  : created_at,
                })
                    .then(function (car) {
                        return car;
                    });
            }


        }
    },



};
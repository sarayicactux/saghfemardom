const request       = require('../configs/mod-config');
const jsonfile      = require('jsonfile');
const url           = require('url');
const mime          = require('mime');
const fs            = require('fs');
const date          = require('date-and-time');
const requestIp     = require('request-ip');
const rn            = require('random-number');
const sm            = require('sitemap');
var prInj = require('../helpers/prInj');
var jDate = require('../helpers/jDate');
var needFul = require('../helpers/needFul');
var ProCity         = require('../models/ProCity');
var Models          = require('../models/Models');
const Password      = require("node-php-password");
//   GpsgzN6jRm%6#h%Wqfuo3U

//  mysql root password     pn3%c6xC70ATpbCgfNUmn$eXzfHRzXJEjmY8!Z

var proCity = new ProCity;

var options = {
    min:  100
    , max:  999999
    , integer: true
}

module.exports = {


    sitemap:function(req,res){
        now = new Date();
        var created_at = date.format(now, 'YYYY-MM-DD HH:mm:ss');




        sitemap = sm.createSitemap ({
            hostname: '',
            cacheTime: 600000,        // 600 sec - cache purge period
            urls: urls
        });
        sitemap.toXML( function (err, xml) {
            if (err) {
                return res.status(500).end();
            }
            res.header('Content-Type', 'application/xml');
            res.send( xml );
        });
    },
    index: function (req,res) {
        page = 1;
        if (req.query.page){
            if (parseInt(req.query.page) < 2){
                res.redirect(host)
            }
            page = req.query.page;
            page = parseInt(prInj.PrInj(page));

        }
        Models.Adv.findAll({where:{status: 1}}).then(function (allAdv) {
            Models.Adv.findAll({
                where:{
                    status: 1
                },
                order:[
                    ['id','desc']
                ],
                include:[
                    Models.BusinessGr,
                    Models.AdvImage,
                    Models.People,
                    Models.Comment
                ],
                offset:(page-1)*10,
                limit:10
            }).then(function (bAdvs) {
                advCnt = allAdv.length;
                refU = host;
                res.render('site/index',{refU:refU,page:page,advCnt:advCnt,bAdvs:bAdvs,res:res,jDate:jDate,needFul:needFul});

            })
        });

    },
    bAdvs: function (req,res) {
        page = 1;
        if (req.query.page){
            if (parseInt(req.query.page) < 2){
                res.redirect(host)
            }
            page = req.query.page;
            page = parseInt(prInj.PrInj(page));

        }
        business_type_id = prInj.PrInj(req.params.id);
        Models.Adv.findAll({where:{status: 1,business_type : business_type_id}})
            .then(function (allAdv) {
                advCnt = allAdv.length;
                Models.Adv.findAll({
                    where:{
                        status: 1,
                        business_type : business_type_id
                    },
                    order:[
                        ['id','desc']
                    ],
                    include:[
                        Models.BusinessGr,
                        Models.AdvImage,
                        Models.People,
                        Models.Comment
                    ],
                    offset:(page-1)*10,
                    limit:10
                }).then(function (bAdvs) {
                    Models.BusinessType.findOne({
                        where:{
                            id : business_type_id
                        },
                        include:[
                            Models.BusinessGr
                        ]
                    }).then(function (bT) {
                        if (bT.length != 0){
                            refU = host+'/a/'+business_type_id;
                            res.render('site/pages/advs',{refU:refU,page:page,advCnt:advCnt,bT:bT,bAdvs:bAdvs,res:res,jDate:jDate,needFul:needFul});

                        }
                        else {
                            res.render('errors/404');
                        }
                    })

                }).catch(function (err) {
                    console.log(err);
                    res.render('errors/404');
                })
            })


    },
    filterAdvs: function (req,res) {
        filterParams = req.query;
        whereO = [];
        daily = res.daily;
        var form        = req.body;
        proC = daily.proCity;
        title = '';
        if (filterParams.word){
            title = prInj.PrInj(filterParams.word);

            if (title.length > 4){

                whereO.push({
                    title : {
                        $like : title
                    }
                });
            }


        }
        if (filterParams.bgr){
            bgr = prInj.PrInj(filterParams.bgr);
            if (bgr != '0'){
                whereO.push({
                    business_gr :parseInt(bgr)
                });
            }


        }
        if (filterParams.bt){
            bt = prInj.PrInj(filterParams.bt);
                whereO.push({
                    business_type :parseInt(bt)
                });



        }
        if (filterParams.pro){

            pro = prInj.PrInj(filterParams.pro);

            if (pro != '-1'){
                pro = proC[filterParams.pro];
                whereO.push({
                    pro_id :pro.id
                });
            }
        }
        if (filterParams.city){

            city = prInj.PrInj(filterParams.city);

            if (city != '0' && city != '999888777'){
                city = pro.cities[city];
                whereO.push({
                    city_id :city.id
                });
            }
        }

        whereO.push({
            status :1
        });
        page = 1;
        if (req.query.page){
            if (parseInt(req.query.page) < 2){
                res.redirect(host)
            }
            page = req.query.page;
            page = parseInt(prInj.PrInj(page));

        }
        Models.Adv.findAll({where:whereO})
            .then(function (allAdv) {
                advCnt = allAdv.length;
                Models.Adv.findAll({
                    where:whereO,
                    order:[
                        ['id','desc']
                    ],
                    include:[
                        Models.BusinessGr,
                        Models.AdvImage,
                        Models.People,
                        Models.Comment
                    ],
                    offset:(page-1)*10,
                    limit:10
                }).then(function (bAdvs) {
                    Models.BusinessType.findOne({
                        where:{
                            id : bt
                        },
                        include:[
                            Models.BusinessGr
                        ]
                    }).then(function (bT) {
                        if (bT.length != 0){
                            refU = host+'/fad?bt='+bt+'&word='+title+'&bgr='+bgr+'&pro='+filterParams.pro+'&city='+filterParams.city;
                            res.render('site/pages/filterAdv',{filterParams:filterParams,refU:refU,page:page,advCnt:advCnt,bT:bT,bAdvs:bAdvs,res:res,jDate:jDate,needFul:needFul});

                        }
                        else {
                            res.render('errors/404');
                        }
                    })

                }).catch(function (err) {
                    console.log(err);
                    res.render('errors/404');
                })
            })


    },
    cars: function (req,res) {

        Models.Car.findAll({

            order:[
                ['id','desc']
            ],
            include:[
                Models.Brand1,
                Models.Brand2,
                Models.CarImage,
            ],
            offset:0,
            limit:20
        }).then(function (cars) {
            res.render('site/pages/cars',{cars:cars,res:res,jDate:jDate,needFul:needFul});
        })

    },
    byeSellingType:function(req,res){
        model        = prInj.PrInj(req.params.model_id);
        selling_type = prInj.PrInj(req.params.selling_type);
            page = 1;
            if (req.query.page){
                if (parseInt(req.query.page) < 2){
                    res.redirect(host)
                }
                page = req.query.page;
                page = parseInt(prInj.PrInj(page));

            }
            Models.CarAdv.findAll({where:{
                    status       : 1,
                    selling_type : selling_type,
                    model        : model,
                }}).then(function (allAdv) {
                Models.CarAdv.findAll({
                    where:{
                        status       : 1,
                        selling_type : selling_type,
                        model        : model,
                    },
                    order:[
                        ['id','desc']
                    ],
                    include:[
                        Models.CarAdvImage,
                        Models.Brand1,
                        Models.Car,
                        Models.People
                    ],
                    offset:(page-1)*10,
                    limit:10
                }).then(function (cAdvs) {
                    advCnt = allAdv.length;
                    refU = host+'/bca/'+model+'/'+selling_type;
                    credit = 0;
                    if (req.session.people){
                        credit = req.session.people.credit;
                    }
                    filterParams = {};
                    filterParams.model        = model;
                    filterParams.selling_type = selling_type;

                    res.render('site/pages/byeSellingType',{filterParams:filterParams,credit:credit,refU:refU,page:page,advCnt:advCnt,cAdvs:cAdvs,res:res,jDate:jDate,needFul:needFul});


                })
            });
        } ,
    carAdvDetail:function(req,res){
        id        = prInj.PrInj(req.params.id);

            Models.CarAdv.findAll({where:{
                    status   : 1,
                    id       : id
                }, include:[
                    Models.CarAdvImage,
                    Models.Brand1,
                    Models.Car,
                    Models.People
                ]
            }).then(function (cAdvs) {
                    if (cAdvs.length == 1){
                        Models.CarAdv.findAll({
                            where:{
                                status       : 1,
                                model        : cAdvs[0].model,
                                id           : {
                                    $ne : cAdvs[0].id
                                }
                            },
                            order:[
                                ['id','desc']
                            ],
                            include:[
                                Models.CarAdvImage,
                                Models.Brand1,
                                Models.Car,
                                Models.People
                            ],
                            offset:0,
                            limit:10
                        }).then(function (relative) {
                            credit = 0;
                            if (req.session.people){
                                credit = req.session.people.credit;
                            }
                            advCnt = 1;
                            refU = host+'/cd/'+id;
                            page = 1;
                           res.render('site/pages/carAdvDetail',{credit:credit,refU:refU,page:page,advCnt:advCnt,relative:relative,cAdvs:cAdvs,res:res,jDate:jDate,needFul:needFul});


                        })
                    }
                    else {
                        res.render('errors/404');
                    }

            });
        } ,
    bCar:function(req,res){
        {
            page = 1;
            if (req.query.page){
                if (parseInt(req.query.page) < 2){
                    res.redirect(host)
                }
                page = req.query.page;
                page = parseInt(prInj.PrInj(page));

            }
            Models.CarAdv.findAll({where:{
                    status       : 1,
                }}).then(function (allAdv) {
                Models.CarAdv.findAll({
                    where:{
                        status       : 1,
                    },
                    order:[
                        ['id','desc']
                    ],
                    include:[
                        Models.CarAdvImage,
                        Models.Brand1,
                        Models.Car,
                        Models.People
                    ],
                    offset:(page-1)*10,
                    limit:10
                }).then(function (cAdvs) {
                    advCnt = allAdv.length;
                    refU = host+'/bCar';
                    credit = 0;
                    if (req.session.people){
                        credit = req.session.people.credit;
                    }
                    res.render('site/pages/byeCar',{credit:credit,refU:refU,page:page,advCnt:advCnt,cAdvs:cAdvs,res:res,jDate:jDate,needFul:needFul});


                })
            });
        }
    },
    filterCars: function (req,res) {
        filterParams = req.query;
        whereO = [];
        model = '';
        if (filterParams.model){
            model = prInj.PrInj(filterParams.model);

            if (model.length > 2){

                whereO.push({
                    model : {
                        $like : model
                    }
                });
            }


        }
        if (filterParams.brand){
            brand = prInj.PrInj(filterParams.brand);
            if (brand != '0'){
                whereO.push({
                    $or : {
                        brand1_id: brand,
                        brand2_id: brand
                    }
                });
            }


        }

        Models.Car.findAll({
            where:whereO,
            order:[
                ['id','desc']
            ],
            include:[
                Models.Brand1,
                Models.Brand2,
                Models.CarImage,
            ],
            offset:0,
            limit:40
        }).then(function (cars) {
            res.render('site/pages/filterCars',{filterParams:filterParams,cars:cars,res:res,jDate:jDate,needFul:needFul});
        })

    },
    filterCarsAdv: function (req,res) {
        filterParams = req.query;
        proC = res.daily.proCity;
        whereO = [];
        text = '';
        if (filterParams.text){
            text = prInj.PrInj(filterParams.text);

            if (text.length > 2){

                whereO.push({
                    title : {
                        $like : text
                    }
                });
            }


        }
        if (filterParams.model){
            model = prInj.PrInj(filterParams.model);

            whereO.push({
                model :model
            });


        }
        if (filterParams.selling_type){
            selling_type = prInj.PrInj(filterParams.selling_type);
            if(selling_type != '0'){
                whereO.push({
                    selling_type :selling_type
                });
            }



        }
        if (filterParams.brand){
            brand = prInj.PrInj(filterParams.brand);
            if (brand != '0'){
                whereO.push({
                    brand :brand
                });
            }


        }
        if (filterParams.pro){

            pro = prInj.PrInj(filterParams.pro);

            if (pro != '-1'){
                pro = proC[filterParams.pro];
                whereO.push({
                    pro_id :pro.id
                });
            }
        }
        if (filterParams.city){

            city = prInj.PrInj(filterParams.city);

            if (city != '0' && city != '999888777'){
                city = pro.cities[city];
                whereO.push({
                    city_id :city.id
                });
            }
        }

        whereO.push({
            status :1
        });
        page = 1;
        if (req.query.page){
            if (parseInt(req.query.page) < 2){
                res.redirect(host)
            }
            page = req.query.page;
            page = parseInt(prInj.PrInj(page));

        }
        Models.CarAdv.findAll({where:whereO})
            .then(function (allAdv) {
                advCnt = allAdv.length;
                Models.CarAdv.findAll({
                    where:whereO,
                    order:[
                        ['id','desc']
                    ],
                    include:[
                        Models.CarAdvImage,
                        Models.Brand1,
                        Models.Car,
                        Models.People
                    ],
                    offset:(page-1)*10,
                    limit:10
                }).then(function (cAdvs) {
                    credit = 0;
                    if (req.session.people){
                        credit = req.session.people.credit;
                    }
                    refU = host+'/fad?text='+filterParams.text+'&model='+filterParams.model+'&brand='+filterParams.brand+'&pro='+filterParams.pro+'&city='+filterParams.city+'&selling_type='+filterParams.selling_type;
                    res.render('site/pages/filterCarAdv',{credit:credit,filterParams:filterParams,refU:refU,page:page,advCnt:advCnt,cAdvs:cAdvs,res:res,jDate:jDate,needFul:needFul});

                }).catch(function (err) {
                    console.log(err);
                    res.render('errors/404');
                })
            })

    },
    cities:function (req,res) {
        pro_id = req.params.id;
        proCity.find('all',{where:'pro_id = '+ pro_id},function (err,cities) {
            if (err){
                res.render('errors/500');
            }
            else {
                res.render('site/all/cities',{cities:cities});
            }
        });

    },
    newsDetail:function(req,res){
        slug = prInj.PrInj(req.params.slug);
        Models.News.findOne({
            where:{
                slug    : slug,
                active  : 1
            }
        }).then(function (newD) {
            if(newD){
                res.render('site/pages/newsDetail',{newD:newD,res:res,jDate:jDate,needFul:needFul});
            }
            else {
                res.status(404);
                res.render('errors/404');
            }

        })


    },
    news: function (req,res) {
        page = 1;
        if (req.query.page){
            if (parseInt(req.query.page) < 2){
                res.redirect(host)
            }
            page = req.query.page;
            page = parseInt(prInj.PrInj(page));

        }
        Models.News.findAll({where:{active: 1}})
            .then(function (allNews) {
                newsCnt = allNews.length;
                Models.News.findAll({
                    where:{
                        active: 1,
                    },
                    order:[
                        ['id','desc']
                    ],
                    offset:(page-1)*10,
                    limit:10
                }).then(function (news) {
                    refU = host+'/news';
                    res.render('site/pages/news',{refU:refU,page:page,newsCnt:newsCnt,news:news,res:res,jDate:jDate,needFul:needFul});


                }).catch(function (err) {
                    console.log(err);
                    res.render('errors/404');
                })
            })


    },
    send:function(req,res){

            res.render('site/ads/chooseType',{res:res,jDate:jDate,needFul:needFul});

    },

    citiesList:function(req,res){

            pro_r = req.body.pro;
            if (pro_r == '-1'){
                cities = [
                    {
                        name : 'همه ایران'
                    }

                ];
            }
            else {
                allPro = res.daily.proCity;
                cities = allPro[pro_r].cities;
            }

            res.render('site/all/citiesList',{cities:cities});
    },
    modelsList:function(req,res){
        br = req.body.br;
        Models.Car.findAll({
            where:{
                $or : {
                     brand1_id: br,
                     brand2_id: br
                }
               
            }
        }).then(function(cars){
            res.render('site/all/modelList',{cars:cars});
        });
        
        
    },
    businessGrsList:function(req,res){
            bt = req.body.bt;
            allType = res.daily.BusinessType;
            businessGrs = allType[bt].BusinessGrs;
            res.render('site/all/businessGrsList',{businessGrs:businessGrs});
    },
    chooseAdvType:function(req,res){
                advType = prInj.PrInj(req.body.advType);
                if (advType == '1'){

                    res.render('site/ads/business',{res:res,jDate:jDate,needFul:needFul});
                }
                else if (advType == '2'){
                    res.render('site/ads/cashCar',{res:res,jDate:jDate,needFul:needFul});
                }
                else if (advType == '3'){
                    res.render('site/ads/instCar',{res:res,jDate:jDate,needFul:needFul});
                }
                else if (advType == '4'){
                    people = req.session.people;
                    res.render('site/ads/contactInf',{people:people,res:res,jDate:jDate,needFul:needFul});
                }
                else {
                    res.json('');
                }

    },
    registeAdv:function(req,res){
        daily = res.daily;
        var form        = req.body;
        advImgs = form.advImgs;
        now = new Date();
        var created_at = date.format(now, 'YYYY-MM-DD HH:mm:ss');
        proC = daily.proCity;
        businesses = daily.BusinessType;
        pro = proC[form.pro];
        bus = businesses[form.businessType];
        business_type = bus.id;
        bisGr         = bus.BusinessGrs;
        business_gr   = bisGr[form.businessGr].id;
        newAdv = {
            user_id        : req.session.people.id,
            title          : prInj.PrInj( form.title),
            description    : prInj.PrInj( form.description),
            pro_id         : pro.id,
            pro_name       : pro.name,
            city_id        : pro.cities[form.city].id,
            city_name      : pro.cities[form.city].name,
            business_type  : business_type,
            business_gr    : business_gr,
            video_url      : prInj.PrInj( form.videoPath),
            created_at     : created_at,
            updated_at     : created_at
        }
        Models.Adv.create(newAdv).then(function(nRecord){
                    adv_id = nRecord.id;
                    
                    for(i = 0;i<advImgs.length;i++){
                                newAdvImage(adv_id,advImgs[i]);
                    }
                    res.json({status:true});
                    function newAdvImage(adv_id,imgPath){
                                newImg = {
                                    adv_id : adv_id,
                                    img_url: imgPath,
                                    created_at     : created_at,
                                    updated_at     : created_at
                                };
                                Models.AdvImage.create(newImg);
                                
                    }

        }).catch(function (err) {
            console.log(err);
                res.json( {status: false});return;
            });
    },
    registeCashCar:function(req,res){
        daily = res.daily;
        var form        = req.body;
        advImgs = form.advImgs;
        now = new Date();
        var created_at = date.format(now, 'YYYY-MM-DD HH:mm:ss');
        proC = daily.proCity;
        businesses = daily.BusinessType;
        pro = proC[form.pro];
        newCarAdv = {
            user_id        : req.session.people.id,
            selling_type   : 1,
            title          : prInj.PrInj( form.title),
            description    : prInj.PrInj( form.description),
            brand          : prInj.PrInj( form.brand),
            model          : prInj.PrInj( form.model),
            price          : prInj.PrInj( form.price),
            pro_id         : pro.id,
            pro_name       : pro.name,
            city_id        : pro.cities[form.city].id,
            city_name      : pro.cities[form.city].name,
            delivery_time  : prInj.PrInj( form.delivery_time),
            video_url      : prInj.PrInj( form.videoPath),
            created_at     : created_at,
            updated_at     : created_at
        }
        Models.CarAdv.create(newCarAdv).then(function(nRecord){
            adv_id = nRecord.id;
                    
                    for(i = 0;i<advImgs.length;i++){
                                newCarAdvImage(adv_id,advImgs[i]);
                    }
                    res.json({status:true});
                    function newCarAdvImage(adv_id,imgPath){
                                newImg = {
                                    adv_id : adv_id,
                                    img_url: imgPath,
                                    created_at     : created_at,
                                    updated_at     : created_at
                                };
                                Models.CarAdvImage.create(newImg);
                                
                    }

        }).catch(function (err) {
            console.log(err);
                res.json( {status: false});return;
            });
    },
    registeinstCar:function(req,res){
        daily = res.daily;
        var form        = req.body;
        advImgs = form.advImgs;
        now = new Date();
        var created_at = date.format(now, 'YYYY-MM-DD HH:mm:ss');
        proC = daily.proCity;
        businesses = daily.BusinessType;
        pro = proC[form.pro];
        newCarAdv = {
            user_id        : req.session.people.id,
            selling_type   : 2,
            price          : prInj.PrInj( form.price),
            pre_payment    : prInj.PrInj( form.pre_payment),
            payment_amount : prInj.PrInj( form.payment_amount),
            payment_pr     : prInj.PrInj( form.payment_pr),
            payment_count  : prInj.PrInj( form.payment_count),
            loan_amount    : prInj.PrInj( form.loan_amount),
            delivery_time  : prInj.PrInj( form.delivery_time),
            title          : prInj.PrInj( form.title),
            description    : prInj.PrInj( form.description),
            brand          : prInj.PrInj( form.brand),
            model          : prInj.PrInj( form.model),
            pro_id         : pro.id,
            pro_name       : pro.name,
            city_id        : pro.cities[form.city].id,
            city_name      : pro.cities[form.city].name,
            video_url      : prInj.PrInj( form.videoPath),
            created_at     : created_at,
            updated_at     : created_at
        }
        Models.CarAdv.create(newCarAdv).then(function(nRecord){
            adv_id = nRecord.id;

                    for(i = 0;i<advImgs.length;i++){
                                newCarAdvImage(adv_id,advImgs[i]);
                    }
                    res.json({status:true});
                    function newCarAdvImage(adv_id,imgPath){
                                newImg = {
                                    adv_id : adv_id,
                                    img_url: imgPath,
                                    created_at     : created_at,
                                    updated_at     : created_at
                                };
                                Models.CarAdvImage.create(newImg);

                    }

        }).catch(function (err) {
            console.log(err);
                res.json( {status: false});return;
            });
    },

    updateProfile:function(req,res){

        var form        = req.body;
        Models.People.update({
                phone: prInj.PrInj(form.phone),
                telegram: prInj.PrInj(form.telegram),
                instagram: prInj.PrInj(form.instagram)
        }
        ,{
         where:{
             id : req.session.people.id
         }
         }
            ).then(function (nProfile) {
                req.session.people.phone    = prInj.PrInj(form.phone);
                req.session.people.telegram = prInj.PrInj(form.telegram);
                req.session.people.instagram= prInj.PrInj(form.instagram);
            res.json({status:true});return;

        }).catch(function (err) {
            console.log(err);
            res.json({status:false});return;
        })
    },
    checkLogin:function(req,res){
        var pass     = prInj.PrInj(req.body.password);
        var mobile   = prInj.PrInj(req.body.mobile);
        Models.People.findOne({
            where:{mobile:mobile}
        }).then(function (row) {
            if (row.length != 0){

                if (Password.verify(pass, row.password)){

                    req.session.people = row;
                   res.json({status:true});return;


                }
                else {
                    res.json({status:false});return;
                }
            }

            else {
                res.json({status:false});return;
            }
        })
            .catch(function (err) {
                res.json({status:false});
                return;
            })
    },
    register:function(req,res){
        if (!req.session.people){

            now = new Date();
            req.session.regRq = Password.hash(now+'k');
            res.render('site/people/register',{res:res,jDate:jDate,needFul:needFul});
        }
        else {
            res.render('site/ads/chooseType',{res:res,jDate:jDate,needFul:needFul});
        }

    },
    sendRcode:function(req,res){
        var form        = prInj.PrAll(req.body);
        Models.People.findOne({where:{mobile:form.mobile}})
            .then(function (people) {
                if(!people){
                    if (!req.session.regRq){
                        res.json( {status:true});return
                    }

                    else {
                        if (!req.session.count){
                            req.session.count = 1;
                            req.session.fBody = form;
                            rq = needFul.sendSmsCode(form.mobile);

                            req.session.rCode = rq;
                            res.json( {status:true});return


                        }
                        else {
                            if (req.session.count < 4){
                                req.session.count += 1;
                                rq = needFul.sendSmsCode(form.mobile);
                                req.session.fBody = form;
                                req.session.rCode = rq;
                                res.json( {status:true});return
                            }
                            res.json( {status:true});return
                        }
                    }
                }
                else {
                    res.json( {status:false});return
                }
            })

    },
    registerPeople:function(req,res){
        var code        = prInj.PrInj(req.body.rCode);
        if (!req.session.regRq){
            res.json( {status: false});return;
        }
        if (!req.session.fBody){
            res.json( {status: false});return;
        }
        if (req.session.rCode != code) {
            res.json( {status: false});return;
        }
        else {
            form = req.session.fBody;
            var slug = form.name+ form.family;
            slug = slug.replace(/ /g,'-');
            slug = slug.replace(/--/g,'-');
            now = new Date();
            var created_at = date.format(now, 'YYYY-MM-DD HH:mm:ss');
            newPeople = {
                name           : form.name,
                family         : form.family,
                mobile         : form.mobile,
                password       : Password.hash(form.password),
                rcode          : code,
                created_at     : created_at,
                updated_at     : created_at,
            }
            Models.People.create(newPeople).then(function (newP) {
                res.json( {status: true});return;
            }).catch(function () {
                res.json( {status: false});return;
            });
            req.session.destroy();
        }
    },
    my:function(req,res){

        peopleInf = res.peopleInf;
        advs      = res.peopleAdvs;

        carAdvs   = res.peopleCarAdvs;
        comments  = res.comments;
        accAdv  = [];
        nAccAdv = [];
        accCar  = [];
        nAccCar = [];
        for (i=0;i<advs.length;i++){
            if (advs[i].status == 1){
                accAdv.push(advs[i]);
            }
            else {
                nAccAdv.push(advs[i]);
            }
        }

        for (i=0;i<carAdvs.length;i++){
            if (carAdvs[i].status == 1){
                accCar.push(carAdvs[i]);
            }
            else {
                nAccCar.push(carAdvs[i]);
            }
        }
            res.render('site/ads/my',{
                res     :res,
                peopleInf:peopleInf,
                accAdv  :accAdv,
                nAccAdv :nAccAdv,
                accCar  :accCar,
                nAccCar :nAccCar,
                comments:comments,
                jDate   :jDate,
                needFul :needFul

            });

    },
    siteUploadImage:function(req,res){
        var tmp_path = req.file.path;
        var advType  = req.body.advType;
        /** The original name of the uploaded file
         stored in the variable "originalname". **/

        checkMime = needFul.checkMime(req.file.originalname,1);
        if (checkMime){
            var rand = rn(options);
            var userFile    = 'panel/'+advType+'/' + rand + req.file.originalname;
            var target_path = appRoot + '/public/panel/'+advType+'/' + rand + req.file.originalname;
            /** A better way to copy the uploaded file. **/
            var src = fs.createReadStream(tmp_path);
            var dest = fs.createWriteStream(target_path);
            src.pipe(dest);
            src.on('end', function() {
                fs.unlinkSync(tmp_path);
                res.json(userFile);return;
            });
        }
        else {
            res.json('false');return;
        }

    },
    siteUploadVideo:function(req,res){
        var tmp_path = req.file.path;
        var advType  = req.body.advType;
        /** The original name of the uploaded file
         stored in the variable "originalname". **/

        checkMime = needFul.checkMime(req.file.originalname,2);

        if (checkMime){
            var rand = rn(options);
            var userFile    = 'panel/'+advType+'/' + rand + req.file.originalname;
            var target_path = appRoot + '/public/panel/'+advType+'/' + rand + req.file.originalname;
            /** A better way to copy the uploaded file. **/
            var src = fs.createReadStream(tmp_path);
            var dest = fs.createWriteStream(target_path);

            var stats = fs.statSync(tmp_path);
            var fileSize = Math.round(stats["size"]/1024/1024);
            if (fileSize > 10){

                res.json('false');return;
            }
            src.pipe(dest);
            src.on('end', function() {
                fs.unlinkSync(tmp_path);
                res.json(userFile);return;
            });
        }
        else {
            res.json('false');return;
        }

    },
    siteUpdeleteUploaded:function (req,res) {
        var file    = req.body.fileName;
        var inputId = req.body.inputId;
        fs.unlinkSync(appRoot + '/public/'+file);
        res.send('<input id="'+inputId+'Path"  type="hidden" value="">');
    },
    siteDeleteUploaded:function (req,res) {
        var file    = req.body.fileName;
        fs.unlinkSync(appRoot + '/public/'+file);
        res.json('');return;
    },

    uploading:function(req,res){
        var tmp_path = req.file.path;
        var inputId  = req.body.inputId;
        var mimeType  = req.body.mimeType;
        /** The original name of the uploaded file
         stored in the variable "originalname". **/
        var rand = rn(options);
        var userFile    = 'panel/register/' + rand + req.file.originalname;
        var target_path = appRoot + '/public/panel/register/' + rand + req.file.originalname;
        /** A better way to copy the uploaded file. **/
        var src = fs.createReadStream(tmp_path);
        var dest = fs.createWriteStream(target_path);
        src.pipe(dest);
        src.on('end', function() {
            fs.unlinkSync(tmp_path);
            if (mimeType == '2'){
                res.render('site/all/videoUploaded',{
                    'userFile':userFile,
                    'inputId' : inputId
                });
            }
            else {
                res.render('site/all/imageUploaded',{
                    'userFile':userFile,
                    'inputId' : inputId
                });
            }

        });
    },
    deleteUploaded:function (req,res) {
        var file    = req.body.fileName;
        var inputId = req.body.inputId;
        fs.unlinkSync(appRoot + '/public/'+file);
        res.send('<input id="'+inputId+'Path"  type="hidden" value="">');
    },
    login:function(req,res){
        if (!req.session.people){
            res.render('site/people/login',{
                error: '',
                res:res,
                jDate:jDate,
                needFul:needFul
            });
        }
        else {
            res.render('site/ads/chooseType',{res:res,jDate:jDate,needFul:needFul});
        }
    },
    logOut:function(req,res){
        req.session.destroy();
        res.redirect(host);
    },


};

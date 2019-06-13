const express     = require('express');
const urlencode   = require('urlencode');
const date        = require('date-and-time');
const multer      = require('multer');

var upload          = multer({ dest: 'public/panel'});
var type            = upload.single('file');
const router        = express.Router();
const jsonfile      = require('jsonfile');
const path          = require('path');

var prInj           = require('../helpers/prInj');

var Models          = require('../models/Models');

var home            = require('../controllers/home');


router.route('/').get(preCond,dailyJson,hourlyJson,home.index);
router.route('/sitemap.xml').get(sitemap,home.sitemap);
router.route('/a/:id').get(preCond,dailyJson,hourlyJson,home.bAdvs);
router.route('/bca/:id').get(preCond,dailyJson,hourlyJson,home.byeCashCar);
router.route('/ica/:id').get(preCond,dailyJson,hourlyJson,home.byinstCar);
router.route('/fad').get(preCond,dailyJson,hourlyJson,home.filterAdvs);
router.route('/fca').get(preCond,dailyJson,hourlyJson,home.filterCars);
router.route('/cars').get(preCond,dailyJson,hourlyJson,home.cars);
router.route('/send').get(checkPeople,preCond,dailyJson,hourlyJson,home.send);
router.route('/registeAdv').post(dailyJson,checkPeopleAjax,home.registeAdv);
router.route('/registeCashCar').post(dailyJson,checkPeopleAjax,home.registeCashCar);
router.route('/registeinstCar').post(dailyJson,checkPeopleAjax,home.registeinstCar);
router.route('/updateProfile').post(dailyJson,checkPeopleAjax,home.updateProfile);
router.route('/chooseAdvType').post(dailyJson,hourlyJson,checkPeopleAjax,home.chooseAdvType);
router.route('/citiesList').post(dailyJson,home.citiesList);
router.route('/modelsList').post(home.modelsList);
router.route('/businessGrsList').post(dailyJson,home.businessGrsList);
router.route('/login').get(preCond,dailyJson,hourlyJson,home.login);
router.route('/login').post(home.checkLogin);
router.route('/logOut').get(home.logOut);
router.route('/register').get(preCond,dailyJson,hourlyJson,home.register);
router.route('/sendRcode').post(home.sendRcode);
router.route('/register').post(preCond,dailyJson,hourlyJson,home.registerPeople);
router.route('/my').get(checkPeople,preCond,dailyJson,hourlyJson,peopleInf,home.my);
router.route('/cities/:id').get(home.cities);

router.route('/siteUploadImage').post(type,home.siteUploadImage);
router.route('/siteUploadVideo').post(type,home.siteUploadVideo);
router.route('/siteDeleteUploaded').post(home.siteDeleteUploaded);

router.route('/uploading').post(type,home.uploading);
router.route('/deleteUploaded').post(home.deleteUploaded);




//export this router to use in our index.js

function peopleInf(req,res,next) {
    if (req.session.people){
        people_id = req.session.people.id;
        Models.People.findOne(
            { where:{ id : people_id},
            include:[
                Models.Comment

            ]
        }).then(function (peopleInf) {
            res.peopleInf = peopleInf;
            Models.Adv.findAll({
                where: {
                    user_id : people_id
                },
                include:[
                    Models.BusinessGr,
                    Models.AdvImage,
                    Models.Comment
                ]
            }).then(function (advs) {
                res.peopleAdvs = advs;
                Models.CarAdv.findAll({
                    where: {
                        user_id : people_id
                    },
                    include:[
                        Models.Brand1,
                        Models.Car,
                        Models.CarAdvImage
                    ]
                }).then(function (carAdvs) {
                    res.peopleCarAdvs = carAdvs;
                    next();
                });
            });


        })

    }

}
function preCond(req,res,next) {
    people = true
    if (!req.session.people){
        people = false;
    }
    res.people = people;
    Models.News.findAll({
        where:{
            active : 1,
            gr_id : 2,
        },
        order:[
            ['id','desc']
        ],
        offset:0,
        limit:20,
    }).then(function (news) {
        res.saghfNews = news;
        Models.News.findAll({
            where:{
                active : 1,
                gr_id : 1,
            },
            order:[
                ['id','desc']
            ],
            offset:0,
            limit:20,
        }).then(function (news) {
            res.carNews = news;

            Models.CarAdv.findAll({
                where:{
                    status : 1,
                },
                order:[
                    ['id','desc']
                ],
                offset:0,
                limit:20,
                include:[
                    Models.CarAdvImage
                ]
            }).then(function (lastCarAdv) {
                res.lastCarAdv = lastCarAdv;
                Models.Car.findAll({
                    where:{
                        show_price : 1,
                    },
                    order:[
                        ['updated_at','desc']
                    ],
                    offset:0,
                    limit:50,
                }).then(function (carPrice) {
                    res.carPrice = carPrice;
                    next();
                });



            }).catch(function (err) {

            });


        });
    });

}
function checkPeopleAjax(req,res,next) {

    if(!req.session.people){
        res.json({status:false});return
    }
    next();
}
function checkPeople(req,res,next) {
    if(!req.session.people){
        res.redirect('/login')
        return;
    }
    next();
}
function pageLog(req,res,next){}
function dailyJson(req,res,next){
    const daily  = path.resolve()+'/public/daily.json';
    jsonfile.readFile(daily, function (err, obj) {
        if (err) console.error(err);

        res.daily = obj;
        next();

    });




}
function hourlyJson(req,res,next){
    const hourly = path.resolve()+'/public/hourly.json';

    jsonfile.readFile(hourly, function (err, obj) {
        if (err) console.error(err)
        res.hourly = obj;
        next();



    });




}
function sitemap(req,res,next){

    Models.Category.findAll({
        order: [
            ['rank', 'DESC'],
        ],
        where:{
            have_con : 1,
        }
    })
        .then(function (c) {
        cats = [];
        for(i=0;i<c.length;i++){
            cats[i] = {
                'url'     : '/'+c[i].slug,
                'lastmod' : c[i].updated_at,
                'changefreq' : 'daily',
                'priority' : 0.5,
            }

        }
        res.cats = cats;


    });
    Models.News.findAll({
        order: [
            ['id', 'DESC'],
        ]
    })
        .then(function (c) {
            news = [];
            for(i=0;i<c.length;i++){
                news[i] = {
                    'url'     : '/news/'+c[i].slug,
                    'lastmod' : c[i].updated_at,
                    'changefreq' : 'daily',
                    'priority' : 0.5,
                }

            }
            res.news = news;


        });
    Models.Source.findAll({
        order: [
            ['id', 'DESC'],
        ]
    })
        .then(function (c) {
            reference = [];
            for(i=0;i<c.length;i++){
                reference[i] = {
                    'url'     : '/reference/'+c[i].slug,
                    'lastmod' : c[i].updated_at,
                    'changefreq' : 'daily',
                    'priority' : 0.5,
                }

            }
            res.reference = reference;


        });
    Models.User.findAll({
        where:{
            aType : 2,
        }
    })
        .then(function (u) {
            authors = [];
            for(i=0;i<u.length;i++){
                authors[i] = {
                    'url'       : '/legalExpert/'+u[i].slug,
                    'lastmod'   : u[i].updated_at,
                    'changefreq': 'daily',
                    'priority'  : 0.5,
                }

            }
            res.authors = authors;
        });
    /*Models.SearchsResult.findAll({
        where:{
            results : {
                $gt : 3
            }
        }
    })
        .then(function (s) {
            searchs = [];
            for(i=0;i<s.length;i++){
                searchs[i] = {
                    'url'       : '/findContent?q='+s[i].title,
                    'lastmod'   : s[i].updated_at,
                    'changefreq': 'daily',
                    'priority'  : 0.9,
                }

            }
            res.searchs = searchs;

        });*/

    Models.VContent.findAll({
        order: [
            ['id', 'DESC'],
        ],
        where:{
            active : 1
        },
        include:[
            Models.User
        ],


    })
        .then(function (v) {

            VContents = [];
            for(i=0;i<v.length;i++){
                VContents[i] = {
                    'url'        : '/'+v[i].user.slug+'/'+v[i].slug,
                    'lastmod'    : v[i].updated_at,
                    'changefreq' : 'daily',
                    'priority'   : 0.9,
                }
            }
            res.VContents = VContents;
            setTimeout(function() {
                next();
            }, 2000);

        });

}

module.exports = router;
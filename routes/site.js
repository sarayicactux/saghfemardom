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
router.route('/news/:slug').get(preCond,dailyJson,hourlyJson,home.newsDetail);
router.route('/news').get(preCond,dailyJson,hourlyJson,home.news);
router.route('/faq').get(preCond,dailyJson,hourlyJson,home.faq);
router.route('/a/:id').get(preCond,dailyJson,hourlyJson,home.bAdvs);
router.route('/cd/:id').get(preCond,dailyJson,hourlyJson,home.carAdvDetail);
router.route('/search').get(preCond,dailyJson,hourlyJson,home.search);
router.route('/search').post(preCond,dailyJson,hourlyJson,home.searchR);
router.route('/bca/:model_id/:selling_type').get(preCond,dailyJson,hourlyJson,home.byeSellingType);
router.route('/people/b/:id').get(preCond,dailyJson,hourlyJson,home.peopleB);
router.route('/people/car/:id').get(preCond,dailyJson,hourlyJson,home.peopleCar);
router.route('/editA/:id').get(checkPeople,preCond,dailyJson,hourlyJson,home.editA);
router.route('/editC/:id').get(checkPeople,preCond,dailyJson,hourlyJson,home.editC);
router.route('/changeAdvStat/:status/:id').get(checkPeople,preCond,dailyJson,hourlyJson,home.changeAdvStat);
router.route('/changeCarStat/:status/:id').get(checkPeople,preCond,dailyJson,hourlyJson,home.changeCarStat);
router.route('/bCar').get(preCond,dailyJson,hourlyJson,home.bCar);
router.route('/fad').get(preCond,dailyJson,hourlyJson,home.filterAdvs);
router.route('/fca').get(preCond,dailyJson,hourlyJson,home.filterCars);
router.route('/fbca').get(preCond,dailyJson,hourlyJson,home.filterCarsAdv);
router.route('/cars').get(preCond,dailyJson,hourlyJson,home.cars);
router.route('/send').get(checkPeople,preCond,dailyJson,hourlyJson,home.send);
router.route('/pay').get(checkPeople,preCond,dailyJson,hourlyJson,home.pay);
router.route('/pay/ch').post(checkPeople,preCond,dailyJson,hourlyJson,home.payCheck);
router.route('/advComment').post(dailyJson,checkPeopleAjax,home.advComment);
router.route('/registeAdv').post(dailyJson,checkPeopleAjax,home.registeAdv);
router.route('/editA/updateAdv').post(dailyJson,checkPeopleAjax,home.updateAdv);
router.route('/editC/updateCashCar').post(dailyJson,checkPeopleAjax,home.updateCashCar);
router.route('/editC/updateInstCar').post(dailyJson,checkPeopleAjax,home.updateInstCar);
router.route('/replyMsg').post(dailyJson,checkPeopleAjax,home.replyMsg);
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
router.route('/fg/p').get(preCond,dailyJson,hourlyJson,home.forgetPass);
router.route('/sendPcode').post(home.sendPcode);
router.route('/updatePass').post(preCond,dailyJson,hourlyJson,home.updatePass);

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
                    Models.Comment.findAll({
                        where:{
                            people_id : people_id
                        },
                        include:[
                            Models.Adv
                        ]
                    }).then(function (comments) {
                        res.comments = comments;
                        next();
                    })

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
                    dis_status   : 1,
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
    if(!req.session.people) {
        peopleGinf = [];
    }
    else {
        peopleGinf = req.session.people;
    }
    res.peopleGinf = peopleGinf;
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

    Models.CarAdv.findAll({
        order: [
            ['id', 'DESC'],
        ],
        where:{
            status     : 1,
            dis_status : 1,
        }
    })
        .then(function (c) {
            CarAdv = [];
        for(i=0;i<c.length;i++){
            CarAdv[i] = {
                'url'     : '/cd/'+c[i].id,
                'lastmod' : c[i].updated_at,
                'changefreq' : 'daily',
                'priority' : 0.5,
            }

        }
        res.CarAdv = CarAdv;
            Models.News.findAll({
                where:{
                    active : 1
                },
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
                    next();

                });

    });



}

module.exports = router;
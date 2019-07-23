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

var api            = require('../controllers/api');


router.route('/').get(preCond,dailyJson,hourlyJson,api.index);
router.route('/register').get(api.register);
router.route('/sendRcode').post(sendRcode,api.sendRcode);
router.route('/register').post(preCond,dailyJson,hourlyJson,api.registerPeople);
router.route('/login').post(api.checkLogin);

















router.route('/news/:slug').get(preCond,dailyJson,hourlyJson,api.newsDetail);
router.route('/news').get(preCond,dailyJson,hourlyJson,api.news);
router.route('/faq').get(preCond,dailyJson,hourlyJson,api.faq);
router.route('/a/:id').get(preCond,dailyJson,hourlyJson,api.bAdvs);
router.route('/cd/:id').get(preCond,dailyJson,hourlyJson,api.carAdvDetail);
router.route('/search').get(preCond,dailyJson,hourlyJson,api.search);
router.route('/search').post(preCond,dailyJson,hourlyJson,api.searchR);
router.route('/bca/:model_id/:selling_type').get(preCond,dailyJson,hourlyJson,api.byeSellingType);
router.route('/people/b/:id').get(preCond,dailyJson,hourlyJson,api.peopleB);
router.route('/people/car/:id').get(preCond,dailyJson,hourlyJson,api.peopleCar);
router.route('/editA/:id').get(checkPeople,preCond,dailyJson,hourlyJson,api.editA);
router.route('/editC/:id').get(checkPeople,preCond,dailyJson,hourlyJson,api.editC);
router.route('/changeAdvStat/:status/:id').get(checkPeople,preCond,dailyJson,hourlyJson,api.changeAdvStat);
router.route('/changeCarStat/:status/:id').get(checkPeople,preCond,dailyJson,hourlyJson,api.changeCarStat);
router.route('/bCar').get(preCond,dailyJson,hourlyJson,api.bCar);
router.route('/fad').get(preCond,dailyJson,hourlyJson,api.filterAdvs);
router.route('/fca').get(preCond,dailyJson,hourlyJson,api.filterCars);
router.route('/fbca').get(preCond,dailyJson,hourlyJson,api.filterCarsAdv);
router.route('/cars').get(preCond,dailyJson,hourlyJson,api.cars);
router.route('/send').get(checkPeople,preCond,dailyJson,hourlyJson,api.send);
router.route('/pay').get(checkPeople,preCond,dailyJson,hourlyJson,api.pay);
router.route('/pay/ch').post(checkPeople,preCond,dailyJson,hourlyJson,api.payCheck);
router.route('/advComment').post(dailyJson,checkPeopleAjax,api.advComment);
router.route('/registeAdv').post(dailyJson,checkPeopleAjax,api.registeAdv);
router.route('/editA/updateAdv').post(dailyJson,checkPeopleAjax,api.updateAdv);
router.route('/editC/updateCashCar').post(dailyJson,checkPeopleAjax,api.updateCashCar);
router.route('/editC/updateInstCar').post(dailyJson,checkPeopleAjax,api.updateInstCar);
router.route('/replyMsg').post(dailyJson,checkPeopleAjax,api.replyMsg);
router.route('/registeCashCar').post(dailyJson,checkPeopleAjax,api.registeCashCar);
router.route('/registeinstCar').post(dailyJson,checkPeopleAjax,api.registeinstCar);
router.route('/updateProfile').post(dailyJson,checkPeopleAjax,api.updateProfile);
router.route('/chooseAdvType').post(dailyJson,hourlyJson,checkPeopleAjax,api.chooseAdvType);
router.route('/citiesList').post(dailyJson,api.citiesList);
router.route('/modelsList').post(api.modelsList);
router.route('/businessGrsList').post(dailyJson,api.businessGrsList);
router.route('/logOut').get(api.logOut);

router.route('/my').get(checkPeople,preCond,dailyJson,hourlyJson,peopleInf,api.my);
router.route('/cities/:id').get(api.cities);
router.route('/fg/p').get(preCond,dailyJson,hourlyJson,api.forgetPass);
router.route('/sendPcode').post(api.sendPcode);
router.route('/updatePass').post(preCond,dailyJson,hourlyJson,api.updatePass);

router.route('/siteUploadImage').post(type,api.siteUploadImage);
router.route('/siteUploadVideo').post(type,api.siteUploadVideo);
router.route('/siteDeleteUploaded').post(api.siteDeleteUploaded);

router.route('/uploading').post(type,api.uploading);
router.route('/deleteUploaded').post(api.deleteUploaded);





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
function sendRcode(req,res,next){

    var form        = prInj.PrAll(req.body);
    Models.RegisterRq.findOne({
        where:{
            mobile : form.mobile
        }
    }).then(function (row) {
        if(! row){
            next()
        }
        else if(row.count > 4){
            res.json({
                status      : false,
                reason      : 'Much unsuccessful attempt'

            });return
        }
        else {
            next();
        }
    })

}

module.exports = router;
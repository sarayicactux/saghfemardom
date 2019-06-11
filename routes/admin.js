const express     = require('express');
const urlencode   = require('urlencode');
const date        = require('date-and-time');

var admin          = require('../controllers/admin');
var news           = require('../controllers/news');
var faq            = require('../controllers/faq');
var staticC        = require('../controllers/static');
var cars           = require('../controllers/cars');
var business       = require('../controllers/business');

const router        = express.Router();
const jsonfile      = require('jsonfile');
const path          = require('path');
var   prInj         = require('../helpers/prInj');
var   Models        = require('../models/Models');

router.route('/').get(checkAccess(1),admin.dash);
router.route('/changePass').post(checkAccess(1),admin.changePass);


// user role permission
router.route('/users').get(checkAccess(0),admin.users);

// static Content
router.route('/static/list').get(checkAccess(6),staticC.list);
router.route('/static/:id/edit').get(checkAccess(6),staticC.edit);
router.route('/static/:id/update').post(checkAccess(6),staticC.Update);

// FAQ
router.route('/faq/add').get(checkAccess(5),faq.add);
router.route('/faq/create').post(checkAccess(5),faq.create);
router.route('/faq/list').get(checkAccess(5),faq.list);
router.route('/faq/changeStatus').post(checkAccess(5),faq.changeStatus);
router.route('/faq/:id/edit').get(checkAccess(5),faq.edit);
router.route('/faq/:id/update').post(checkAccess(5),faq.Update);

//news
router.route('/news/add').get(checkAccess(1),news.add);
router.route('/news/create').post(checkAccess(1),news.create);
router.route('/news/list').get(checkAccess(1),news.list);
router.route('/news/changeStatus').post(checkAccess(1),news.changeStatus);
router.route('/news/:id/edit').get(checkAccess(1),news.edit);
router.route('/news/:id/update').post(checkAccess(1),news.Update);


//Brands
router.route('/brands').get(checkAccess(2),cars.brands);
router.route('/createUpdateBrand').post(checkAccess(2),cars.createUpdateBrand);
//Cars
router.route('/cars').get(checkAccess(3),cars.cars);
router.route('/cars/add').get(checkAccess(3),brands,cars.add);
router.route('/cars/update/:id').get(checkAccess(3),brands,cars.update);
router.route('/cars/createUpdateCar').post(checkAccess(3),cars.createUpdateCar);

//Business
router.route('/business/:typeId').get(checkAccess(4),business.business);
router.route('/business/createUpdateBgr').post(checkAccess(4),business.createUpdateBgr);





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
function brands(req,res,next){
    Models.Brand1.findAll({
        order:[
            ['id','desc']
        ]
    }) .then(function (brands) {
        res.brands = brands;
        next();
    })
}
function checkAccess(module_id) {

    return function(req, res, next) {
        global.fullAccess = true;
        next();
        return;
        global.fullAccess = false;
        Models.Permission.findAll({where:{
                role_id : req.session.user.role_id
            }}).then(function (per) {
            access = [];
            modules = [];

            for (i=0;i<per.lenght;i++){
                mPer = false;
                if (per[i].access == 1){
                    mPer = false;
                }
                if (req.session.user.id == 1){
                    mPer = true;
                }
                access.push(mPer);
                modules.push(per[i].module_id);
            }
            global.access   = access;
            global.modules = modules;

        });
        if (req.session.user.id == 1){
            global.fullAccess = true;
            next();
        }
        else {
            Models.Permission.findOne({
                where:{
                    role_id : req.session.user.role_id,
                    module_id : module_id
                }
            }).then(function (row) {
                    if (row.access == 1){
                        next();
                    }
                    else {
                        res.redirect(host);
                    }
            })

        }




    }
}



//export this router to use in our index.js
module.exports = router;
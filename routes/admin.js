const express     = require('express');
const urlencode   = require('urlencode');
const date        = require('date-and-time');

var admin          = require('../controllers/admin');
var news           = require('../controllers/news');
var cars           = require('../controllers/cars');
var business       = require('../controllers/business');

const router        = express.Router();
const jsonfile      = require('jsonfile');
const path          = require('path');
var   prInj         = require('../helpers/prInj');
var   Models        = require('../models/Models');

router.route('/').get(admin.dash);
router.route('/changePass').post(admin.changePass);



//news
router.route('/news/add').get(news.add);
router.route('/news/create').post(news.create);
router.route('/news/list').get(news.list);
router.route('/news/changeStatus').post(news.changeStatus);
router.route('/news/:id/edit').get(news.edit);
router.route('/news/:id/update').post(news.Update);


//Brands
router.route('/brands').get(cars.brands);
router.route('/createUpdateBrand').post(cars.createUpdateBrand);
//Cars
router.route('/cars').get(cars.cars);
router.route('/cars/add').get(brands,cars.add);
router.route('/cars/update/:id').get(brands,cars.update);
router.route('/cars/createUpdateCar').post(cars.createUpdateCar);

//Business
router.route('/business/:typeId').get(business.business);
router.route('/business/createUpdateBgr').post(business.createUpdateBgr);





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


//export this router to use in our index.js
module.exports = router;
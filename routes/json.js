var express       = require('express');
const date        = require('date-and-time');
var json   = require('../controllers/json');
var jDate  = require('../helpers/jDate');
var User            = require('../models/User');
var ProCity         = require('../models/ProCity');
var Models         = require('../models/Models');
var router = express.Router();

var user = new User();
var proCity = new ProCity;
 router.route('/daily').get(daily,json.daily);
 router.route('/hourly').get(hourly,json.hourly);

//export this router to use in our index.js
function daily(req,res,next){

  Models.ProCity.findAll().then(function (cities) {
          pros = [];
          prB = []
          for(i=0;i<cities.length;i++){
                if(cities[i].pro_id == 0){
                   pro= {
                    id     : cities[i].id,
                    pro_id : cities[i].pro_id,
                    name   : cities[i].name,
                    cities : [],
                   };
                   pros.push(pro);
                   prB.push(cities[i].id)
                }
                else {
                      index = prB.indexOf(cities[i].pro_id);
                      if (index != -1){
                       pros[index].cities.push(cities[i]) ;
                      }

                }
          }
          res.pros = pros;
   Models.Brand1.findAll().then(function (brands) {

    res.brands = brands;
    Models.Car.findAll({
     include:[
      Models.Brand1,
      Models.Brand2,
     ]
    }).then(function (cars) {
     res.cars = cars;
     Models.BusinessType.findAll({
      include:[
       Models.BusinessGr
      ]
     }).then(function (BusinessType) {
      res.BusinessType = BusinessType;
      next();
     });
    });
   });



  });


}
function hourly(req,res,next){





}
module.exports = router;
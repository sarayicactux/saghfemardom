var express     = require('express');
const date      = require('date-and-time');
var json        = require('../controllers/json');
var jDate       = require('../helpers/jDate');
var User        = require('../models/User');
var ProCity     = require('../models/ProCity');
var Models      = require('../models/Models');
var router      = express.Router();

var user = new User();
var proCity = new ProCity;
 router.route('/daily').get(daily,json.daily);
 router.route('/hourly').get(hourly,json.hourly);

//export this router to use in our index.js
function daily(req,res,next){
    now = new Date();
    var oneM = date.format(date.addDays(now, - (31)), 'YYYY-MM-DD HH:mm:ss');
    Models.Payment.findAll({
        where:{
            created_at :{
                $lte : oneM
            }
        }
    }).then(function (payments) {
        for(i=0;i<payments.length;i++){
            updateCredit(payments[i].people_id);
        }
    })
    function updateCredit(people_id){
            Models.People.update({
                credit : 0
            },{
                where: {
                    id : people_id
                }
            });
    }
  Models.ProCity.findAll().then(function (cities) {
          pros = [];
          prB = []
          for(i=0;i<cities.length;i++){
                if(cities[i].pro_id == 0){
                    city = {
                        id     : 9999,
                        pro_id : cities[i].id,
                        name   : 'همه شهرهای استان'

                    };
                   pro= {
                    id     : cities[i].id,
                    pro_id : cities[i].pro_id,
                    name   : cities[i].name,
                    cities : [],
                   };
                   pros.push(pro);
                    pros[pros.length - 1].cities.push(city) ;
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
         Models.StaticContent.findAll().then(function (staticContent) {

             res.staticContent = staticContent;
             next();
         });

     });
    });
   });



  });


}
function hourly(req,res,next){

next();



}
module.exports = router;
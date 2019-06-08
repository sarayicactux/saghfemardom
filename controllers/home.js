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
        res.render('site/index',{res:res});
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
    send:function(req,res){

            res.render('site/ads/chooseType',{res:res});

    },
    citiesList:function(req,res){
            pro_r = req.body.pro;
            allPro = res.daily.proCity;
            cities = allPro[pro_r].cities;
            res.render('site/all/citiesList',{cities:cities});
    },
    modelsList:function(req,res){
        br = req.body.br;
        Models.Car.findAll({
            where:{
                $or : {
                     brand1_id: br
                },
                $or : {
                    brand2_id: br
               },
               
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

                    res.render('site/ads/business',{res:res});
                }
                else if (advType == '2'){
                    res.render('site/ads/cashCar',{res:res});
                }
                else if (advType == '3'){
                    res.render('site/ads/instCar',{res:res});
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
                    res.json({status:true});return;
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
                    res.json({status:true});return;
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
                    res.json({status:true});return;
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
            res.render('site/people/register',{res:res});
        }
        else {
            res.render('site/ads/chooseType',{res:res});
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

            res.render('site/ads/my',{res:res});

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
            console.log(fileSize);
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
                res:res
            });
        }
        else {
            res.render('site/ads/chooseType',{res:res});
        }
    },
    logOut:function(req,res){
        req.session.destroy();
        res.redirect(host);
    },


};

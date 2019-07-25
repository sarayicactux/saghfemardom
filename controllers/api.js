const request       = require('../configs/mod-config');
const payRequest    = require('request');
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


    index: function (req,res) {
        page = 1;
        if (req.query.page){
            if (parseInt(req.query.page) < 2){
                res.json({
                    status      : false,
                    reason      : 'خطا در اطلاعات ارسال'

                });return
            }
            page = req.query.page;
            page = parseInt(prInj.PrInj(page));

        }
        Models.Adv.findAll({where:{status: 1,dis_status   : 1}}).then(function (allAdv) {
            Models.Adv.findAll({
                where:{
                    status: 1,
                    dis_status   : 1
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
                carNews = [];
                b = res.carNews;
                for(i=0;i<b.length;i++){
                    buffer = {
                        id    : b[i].id,
                        title : b[i].title,
                        slug  : b[i].slug,
                        summary : b[i].summary,
                        thumb : b[i].thumb,
                    };
                    carNews.push(buffer);


                }
                saghfNews = [];
                b = res.saghfNews;
                for(i=0;i<b.length;i++){
                    buffer = {
                        id    : b[i].id,
                        title : b[i].title,
                        slug  : b[i].slug,
                        summary : b[i].summary,
                        thumb : b[i].thumb,
                    };
                    saghfNews.push(buffer);


                }

                res.json({
                    advCnt      : advCnt,
                    advs        : bAdvs,
                    carNews     : carNews,
                    saghfNews   : saghfNews,
                    lastCarAdv  : res.lastCarAdv,
                    carPrice    : res.carPrice,
                    proCity     : res.daily.proCity,
                    brands      : res.daily.brands,
                    status      : true,
                    reason      : ''
                });return;


            })
        }).catch(function (err) {
            res.json({
                status      : false,
                reason      : 'خطای داخلی سرور'

            });return
        });

    },
    register:function(req,res){
          
            token = needFul.tokenCreator();
            clientIp = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;;
            now = new Date();
            var created_at = date.format(now, 'YYYY-MM-DD HH:mm:ss');
            Models.RegisterRq.create({
                token : token,
                ip    : clientIp,
                rq_time : now,
                created_at : created_at

            }).then(function (r) {
                    res.json({
                        token: token,
                        status      : true,
                        reason      : ''

                    });return
            }).catch(function (err) {

                res.json({
                    status      : false,
                    reason      : 'خطای داخلی سرور'

                });return
            })
    },
    sendRcode:function(req,res){
        var form        = prInj.PrAll(req.body);
        if ( typeof form.token === 'undefined'  ) {

            res.json({
                status      : false,
                reason      : 'توکن ارسال نشده'

            });return
        }
        clientIp = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;;
        Models.RegisterRq.findOne({where:{ip:clientIp}})
            .then(function (m) {
                if(m){
                    if(m.count>4){
                        res.json({
                            status      : false,
                            reason      : 'تلاش بیشتر از تعداد مجاز'

                        });return
                    }
                }
                Models.RegisterRq.findOne({
                    where: {
                        token : form.token
                    }
                })
                    .then(function (r) {
                        if(! r ){

                            res.json({
                                status      : false,
                                reason      : 'توکن معتبر نیست'

                            });return
                        }
                        if(r.count > 4 ){

                            res.json({
                                status      : false,
                                reason      : 'تلاش بیشتر از تعداد مجاز'

                            });return
                        }
                        if (form.mobile.length < 10){
                            res.json({
                                status      : false,
                                reason      : 'شماره موبایل ارسال شده، معتبر نیست'

                            });return
                        }
                        Models.People.findOne({where:{mobile:needFul.toInt(form.mobile)}})
                            .then(function (people) {
                                if(!people){
                                    if (r.mobile == null){
                                        count = 1;
                                    }
                                    else {
                                        count = r.count + 1;
                                    }
                                        mobile = needFul.toInt(form.mobile);
                                        code = needFul.sendSmsCode(needFul.toInt(form.mobile));
                                        Models.RegisterRq.update({
                                            count  : count,
                                            mobile : mobile,
                                            code   : code,
                                        },{
                                            where:{
                                                id : r.id
                                            }
                                        })
                                            .then(function (row) {
                                                res.json({
                                                    status      : true,
                                                    reason      : ''

                                                });return
                                            })
                                            .catch(function (err) {
                                                res.json({
                                                    status      : false,
                                                    reason      : 'خطای داخلی سرور'

                                                });return
                                            })


                                }
                                else {

                                    res.json({
                                        status      : false,
                                        reason      : 'شماره ارسال شده تکراری و یا نامعتبر است'

                                    });return
                                }
                            })
                    })
            });



    },
    registerPeople:function(req,res){
        var form        = prInj.PrAll(req.body);
        if (form.mobile.length < 10){
            res.json({
                status      : false,
                reason      : 'شماره موبایل ارسال شده، معتبر نیست'

            });return
        }
        var code        = form.rCode;
        code = needFul.toInt(code);
        if ( typeof form.token === 'undefined'  ) {

            res.json({
                status      : false,
                reason      : 'توکن ارسال نشده'

            });return
        }
        Models.RegisterRq.findOne({
            where: {
                token : form.token
            }
        })
            .then(function (r) {
                if(!r){
                    res.json({
                        status      : false,
                        reason      : 'توکن نامعتبر است'

                    });return
                }
                else {
                    if (code != r.code){
                        res.json({
                            status      : false,
                            reason      : 'کد ارسال شده نامعتبر است'

                        });return
                    }
                    else {
                        var slug = form.name+ form.family;
                        slug = slug.replace(/ /g,'-');
                        slug = slug.replace(/--/g,'-');
                        now = new Date();
                        var created_at = date.format(now, 'YYYY-MM-DD HH:mm:ss');
                        newPeople = {
                            name           : form.name,
                            family         : form.family,
                            mobile         : r.mobile,
                            password       : Password.hash(form.password),
                            rcode          : code,
                            created_at     : created_at,
                            updated_at     : created_at,
                        }
                        Models.People.create(newPeople).then(function (newP) {
                            r.destroy();
                            res.json({
                                status      : true,
                                reason      : ''

                            });return
                        }).catch(function () {
                            res.json({
                                status      : false,
                                reason      : 'خطای داخلی سرور'

                            });return
                        });
                    }
                }
            })







    },
    checkLogin:function(req,res){

        token = needFul.tokenCreator();
        var pass     = prInj.PrInj(req.body.password);
        var mobile   = prInj.PrInj(req.body.mobile);
        mobile = needFul.toInt(mobile);
        if (mobile < 10){
            res.json({
                status      : false,
                reason      : 'شماره موبایل ارسال شده، معتبر نیست'

            });return
        }
        Models.People.findOne({
            where:{mobile:mobile}
        }).then(function (row) {
            if (row.length != 0){

                if (Password.verify(pass, row.password)){
                    row.update({
                        token : token
                    })
                    res.json({
                        id          : row.id,
                        name        : row.name,
                        family      : row.family,
                        mobile      : row.mobile,
                        telegram    : row.telegram,
                        instagram   : row.instagram,
                        credit      : row.credit,
                        phone       : row.phone,
                        token       : token,
                        status      : true,
                        reason      : ''

                    });return


                }
                else {
                    res.json({
                        status      : false,
                        reason      : 'خطای داخلی سرور'

                    });return
                }
            }

            else {
                res.json({
                    status      : false,
                    reason      : 'خطای داخلی سرور'

                });return
            }
        })
            .catch(function (err) {
                res.json({
                    status      : false,
                    reason      : 'خطای داخلی سرور'

                });return
            })
    },
    logOut:function(req,res){
        id = prInj.PrInj(req.params.id);
        Models.People.update({
            token : ''
        },{
            where:{
                id : id
            }
        }).then(function (e) {
            res.json({
                status      : true,
                reason      : ''

            });return;
        }).catch(function (err) {
            res.json({
                status      : false,
                reason      : 'خطا در اطلاعات ارسال'

            });return;
        })

    },
    changePass:function(req,res){
        var form        = prInj.PrAll(req.body);
        token = form.token;
        id    = form.id;
        clientIp = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;;
        now = new Date();
        var created_at = date.format(now, 'YYYY-MM-DD HH:mm:ss');
        Models.People.findByPk(id)
            .then(function (people) {
                if(people){
                    if(people.token == token){
                        Models.RegisterRq.create({
                            token : token,
                            ip    : clientIp,
                            rq_time : now,
                            created_at : created_at

                        }).then(function (r) {
                            res.json({
                                status      : true,
                                reason      : ''

                            });return
                        }).catch(function (err) {

                            res.json({
                                status      : false,
                                reason      : 'خطای داخلی سرور'

                            });return
                        })
                    }
                    else {
                        res.json({
                            status      : false,
                            reason      : 'توکن ارسال شده معتبر نیست'

                        });return
                    }
                }
                else {
                    res.json({
                        status      : false,
                        reason      : 'کاربر پیدا نشد'

                    });return
                }
            })
            .catch(function (err) {
                res.json({
                    status      : false,
                    reason      : 'خطای داخلی سرور'

                });return
            })

    },
    forgetPass:function(req,res){
        token = needFul.tokenCreator();
        clientIp = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;;
        now = new Date();
        var created_at = date.format(now, 'YYYY-MM-DD HH:mm:ss');
        Models.RegisterRq.create({
            token : token,
            ip    : clientIp,
            rq_time : now,
            created_at : created_at

        }).then(function (r) {
            res.json({
                token: token,
                status      : true,
                reason      : ''

            });return
        }).catch(function (err) {

            res.json({
                status      : false,
                reason      : 'خطای داخلی سرور'

            });return
        })
    },
    sendPcode:function(req,res){
        var form        = prInj.PrAll(req.body);
        if ( typeof form.token === 'undefined'  ) {

            res.json({
                status      : false,
                reason      : 'توکن ارسال نشده'

            });return
        }
        if (form.mobile.length < 10){
            res.json({
                status      : false,
                reason      : 'شماره موبایل ارسال شده، معتبر نیست'

            });return
        }
        clientIp = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;;
        Models.RegisterRq.findOne({where:{ip:clientIp}})
            .then(function (m) {
                if(m){
                    if(m.count>4){
                        res.json({
                            status      : false,
                            reason      : 'تلاش بیشتر از تعداد مجاز'

                        });return
                    }
                }
                Models.RegisterRq.findOne({
                    where: {
                        token : form.token
                    }
                })
                    .then(function (r) {
                        if(! r ){

                            res.json({
                                status      : false,
                                reason      : 'توکن معتبر نیست'

                            });return
                        }
                        if(r.count > 4 ){

                            res.json({
                                status      : false,
                                reason      : 'تلاش بیشتر از تعداد مجاز'

                            });return
                        }

                        Models.People.findOne({where:{mobile:needFul.toInt(form.mobile)}})
                            .then(function (people) {
                                if(people){
                                    if (r.mobile == null){
                                        count = 1;
                                    }
                                    else {
                                        count = r.count + 1;
                                    }
                                    mobile = needFul.toInt(form.mobile);
                                    code = needFul.sendPassSmsCode(needFul.toInt(form.mobile));
                                    Models.RegisterRq.update({
                                        count  : count,
                                        mobile : mobile,
                                        code   : code,
                                    },{
                                        where:{
                                            id : r.id
                                        }
                                    })
                                        .then(function (row) {
                                            res.json({
                                                status      : true,
                                                reason      : ''

                                            });return
                                        })
                                        .catch(function (err) {
                                            res.json({
                                                status      : false,
                                                reason      : 'خطای داخلی سرور'

                                            });return
                                        })


                                }
                                else {

                                    res.json({
                                        status      : false,
                                        reason      : 'شماره ارسال شده نامعتبر است'

                                    });return
                                }
                            })
                    })
            });



    },
    updatePass:function(req,res){
        var form        = prInj.PrAll(req.body);
        if (form.mobile.length < 10){
            res.json({
                status      : false,
                reason      : 'شماره موبایل ارسال شده، معتبر نیست'

            });return
        }
        token = form.token;
        var code        = prInj.PrInj(req.body.rCode);
        code = needFul.toInt(code);
        var password    = prInj.PrInj(req.body.password);
        if ( typeof form.token === 'undefined'  ) {

            res.json({
                status      : false,
                reason      : 'توکن ارسال نشده'

            });return
        }
        Models.People.findOne({where:{mobile:needFul.toInt(form.mobile)}})
            .then(function (people) {

                if(people) {

                    Models.RegisterRq.findOne()
                        .then(function (r) {
                            if (needFul.toInt(form.mobile) != r.mobile){
                                res.json({
                                    status: false,
                                    reason: 'شماره تلفن ارسال شده صحیح نیست'

                                });
                                return
                            }
                            if (r.token == token) {
                                if (r.code != code) {
                                    res.json({
                                        status: false,
                                        reason: 'کد ارسال شده نامعتبر است'

                                    });
                                    return
                                } else {
                                    now = new Date();
                                    var updated_at = date.format(now, 'YYYY-MM-DD HH:mm:ss');
                                    upPass = {
                                        password: Password.hash(password),
                                        updated_at: updated_at,
                                    }
                                    Models.People.update(upPass,
                                        {
                                            where: {
                                                mobile: needFul.toInt(form.mobile)
                                            }
                                        }).then(function (p) {
                                        res.json({
                                            status: true,
                                            reason: ''

                                        });
                                        return
                                    }).catch(function () {
                                        res.json({
                                            status: false,
                                            reason: 'خطای داخلی سرور'

                                        });
                                        return
                                    });
                                }
                            } else {
                                res.json({
                                    status: false,
                                    reason: 'توکن ارسال شده معتبر نیست'

                                });
                                return
                            }
                        })
                        .catch(function (err) {
                            res.json({
                                status: false,
                                reason: 'خطای داخلی سرور'

                            });
                            return
                        })


                }
                else {
                    res.json({
                        status      : false,
                        reason      : 'کاربر پیدا نشد'

                    });return
                }
            })
            .catch(function (err) {
                res.json({
                    status      : false,
                    reason      : 'خطای داخلی سرور'

                });return
            })

    },
    newsDetail:function(req,res){
        id = prInj.PrInj(req.params.id);
        Models.News.findOne({
            where:{
                id      : id,
                active  : 1
            }
        }).then(function (newD) {
            if(newD){
                res.json({
                    newsDetail  : newD,
                    status      : true,
                    reason      : ''

                });return
            }
            else {
                res.json({
                    status      : false,
                    reason      : 'خبر مورد نظر یافت نشد'

                });return
            }

        })


    },
    news: function (req,res) {
        page = 1;
        if (req.query.page){
            if (parseInt(req.query.page) < 2){
                res.json({
                    status      : false,
                    reason      : 'خطا در اطلاعات ارسال'

                });return
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
                }).then(function (b) {
                    newsA = [];
                    for(i=0;i<b.length;i++){
                        buffer = {
                            id    : b[i].id,
                            title : b[i].title,
                            slug  : b[i].slug,
                            summary : b[i].summary,
                            thumb : b[i].thumb,
                        };
                        newsA.push(buffer);

                    }
                    res.json({
                        newsCnt     : newsCnt,
                        news        : newsA,
                        page        : page,
                        status      : true,
                        reason      : ''

                    });return

                }).catch(function (err) {
                    res.json({
                        status      : false,
                        reason      : 'خطای داخلی سرور'

                    });return
                })
            })


    },
    faq: function (req,res) {

        Models.Faq.findAll({where:{active: 1}})
            .then(function (faqs){
                res.json({
                    faqs     : faqs,
                    status   : true,
                    reason   : ''

                });return
            }).catch(function (err) {
            res.json({
                status      : false,
                reason      : 'خطای داخلی سرور'

            });return
        })


    },
    bAdvs: function (req,res) {
        page = 1;
        if (req.query.page){
            if (parseInt(req.query.page) < 2){
                res.json({
                    status      : false,
                    reason      : 'خطا در اطلاعات ارسال'

                });return
            }
            page = req.query.page;
            page = parseInt(prInj.PrInj(page));

        }
        business_type_id = prInj.PrInj(req.params.id);
        Models.Adv.findAll({where:{status: 1,dis_status   : 1,business_type : business_type_id}})
            .then(function (allAdv) {
                advCnt = allAdv.length;
                Models.Adv.findAll({
                    where:{
                        dis_status   : 1,
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
                            res.json({
                                advCnt      : advCnt,
                                bAdvs       : bAdvs,
                                businessType: bT,
                                page        : page,
                                status      : true,
                                reason      : ''

                            });return
                        }
                        else {
                            res.json({
                                status      : false,
                                reason      : 'خطای داخلی سرور'

                            });return
                        }
                    })

                }).catch(function (err) {
                    res.json({
                        status      : false,
                        reason      : 'خطای داخلی سرور'

                    });return
                })
            })


    },
    carAdvDetail:function(req,res){
        id        = prInj.PrInj(req.params.id);

        Models.CarAdv.findAll({where:{
                status   : 1,
                dis_status   : 1,
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
                        dis_status   : 1,
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

                    res.json({

                        cAdv        : cAdvs,
                        relative    : relative,
                        status      : true,
                        reason      : ''

                    });return


                })
            }
            else {
                res.json({
                    status      : false,
                    reason      : 'خطای داخلی سرور'

                });return
            }

        });
    } ,
    searchR:function (req,res) {
        form = prInj.PrAll(req.body);
        mobile = needFul.toInt(form.mobile);
        Models.People.findAll({
            where:{
                $or:{
                    mobile:{
                        $like: '%'+mobile+'%'
                    }

                }
            },
            attributes: ['id', 'name', 'family', 'mobile', 'slug', 'phone']

        }).then(function (peoples) {
            res.json({

                peoples     : peoples,
                status      : true,
                reason      : ''

            });return
        }).catch(function (r) {
            res.json({
                status      : false,
                reason      : 'خطای داخلی سرور'

            });return
        })
    },
    byeSellingType:function(req,res){

        model        = prInj.PrInj(req.params.model_id);
        selling_type = prInj.PrInj(req.params.selling_type);
        page = 1;
        if (req.query.page){
            if (parseInt(req.query.page) < 2){
                res.json({
                    status      : false,
                    reason      : 'خطا در اطلاعات ارسال'

                });return
            }
            page = req.query.page;
            page = parseInt(prInj.PrInj(page));

        }
        Models.CarAdv.findAll({where:{
                status       : 1,
                dis_status   : 1,
                selling_type : selling_type,
                model        : model,
            }}).then(function (allAdv) {
            Models.CarAdv.findAll({
                where:{
                    dis_status   : 1,
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
                res.json({

                    cAdv        : cAdvs,
                    advCnt      : advCnt,
                    page        : page,
                    status      : true,
                    reason      : ''
                });return;


            })
                .catch(function (err) {
                    res.json({
                        status      : false,
                        reason      : 'خطای داخلی سرور'

                    });return
                });
        });
    } ,
    peopleB:function (req,res) {
        id = prInj.PrInj(req.params.id);
        page = 1;
        if (req.query.page){
            if (parseInt(req.query.page) < 2){
                res.json({
                    status      : false,
                    reason      : 'خطا در اطلاعات ارسال'

                });return
            }
            page = req.query.page;
            page = parseInt(prInj.PrInj(page));

        }
        Models.Adv.findAll({where:{status: 1,dis_status   : 1,user_id:id}}).then(function (allAdv) {
            Models.Adv.findAll({
                where:{
                    status      : 1,
                    dis_status  : 1,
                    user_id     :id
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
                res.json({

                    bAdvs       : bAdvs,
                    advCnt      : advCnt,
                    page        : page,
                    status      : true,
                    reason      : ''
                });return;

            })
        });
    },
    peopleCar:function (req,res) {
        id = prInj.PrInj(req.params.id);
        page = 1;
        if (req.query.page){
            if (parseInt(req.query.page) < 2){
                res.json({
                    status      : false,
                    reason      : 'خطا در اطلاعات ارسال'

                });return
            }
            page = req.query.page;
            page = parseInt(prInj.PrInj(page));

        }
        Models.CarAdv.findAll({where:{
                status       : 1,
                dis_status   : 1,
                user_id      : id
            }}).then(function (allAdv) {
            Models.CarAdv.findAll({
                where:{
                    status       : 1,
                    dis_status   : 1,
                    user_id      : id
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
                res.json({

                    cAdvs       : cAdvs,
                    advCnt      : advCnt,
                    page        : page,
                    status      : true,
                    reason      : ''
                });return;


            }).catch(function (err) {
                res.json({
                    status      : false,
                    reason      : 'خطا در اطلاعات ارسال'

                });return
            });
        }).catch(function (err) {
            res.json({
                status      : false,
                reason      : 'خطا در اطلاعات ارسال'

            });return
        });
    },
    modelsList:function(req,res){
        br = req.params.br;
        Models.Car.findAll({
            where:{
                $or : {
                    brand1_id: br,
                    brand2_id: br
                }

            },
            attributes: ['id', 'brand1_id', 'brand1_id', 'model']
        }).then(function(cars){
            res.json({
                cars        : cars,
                status      : true,
                reason      : ''

            });return
        }).catch(function (err) {
            res.json({
                status      : false,
                reason      : 'خطا در اطلاعات ارسال'

            });return
        });


    },
    bCar:function(req,res){

        page = 1;
        if (req.query.page){
            if (parseInt(req.query.page) < 2){
                res.json({
                    status      : false,
                    reason      : 'خطا در اطلاعات ارسال'

                });return
            }
            page = req.query.page;
            page = parseInt(prInj.PrInj(page));

        }
        Models.CarAdv.findAll({where:{
                status       : 1,
                dis_status   : 1,
            }}).then(function (allAdv) {
            Models.CarAdv.findAll({
                where:{
                    status       : 1,
                    dis_status   : 1,
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

                res.json({
                    advCnt      : advCnt,
                    cAdvs       : cAdvs,
                    page        : page,
                    status      : true,
                    reason      : ''

                });return

            })
        });

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
                        $like : '%'+title+'%'
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
                res.json({
                    status      : false,
                    reason      : 'خطا در اطلاعات ارسال'

                });return
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
                            res.json({
                                advCnt      : advCnt,
                                bAdvs       : bAdvs,
                                page        : page,
                                status      : true,
                                reason      : ''

                            });return

                        }
                        else {
                            res.json({
                                status      : false,
                                reason      : 'خطا در اطلاعات ارسال'

                            });return
                        }
                    })

                }).catch(function (err) {
                    console.log(err);
                    res.json({
                        status      : false,
                        reason      : 'خطا در اطلاعات ارسال'

                    });return
                })
            })


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
                        $like : '%'+model+'%'
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
            res.json({
                cars        : cars,
                status      : true,
                reason      : ''

            });return
        }).catch(function () {
            res.json({
                status      : false,
                reason      : 'خطا در اطلاعات ارسال'

            });return
        })

    },
    citiesList:function(req,res){

        pro_r = req.params.pro;
        if (pro_r == '-1'){
            cities = [
                {
                    name : 'همه ایران'
                }

            ];
        }
        else {
            allPro = res.daily.proCity;
            if ( typeof allPro[pro_r] === 'undefined'  ) {

                res.json({
                    status      : false,
                    reason      : 'مقدار ورودی نامعتبر است'

                });return
            }

            cities = allPro[pro_r].cities;
        }
        res.json({
            cities      : cities,
            status      : true,
            reason      : ''

        });return
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
                        $like : '%'+text+'%'
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
                res.json({
                    status      : false,
                    reason      : 'خطا در اطلاعات ارسال'

                });return
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

                    res.json({
                        advCnt      : advCnt,
                        cAdvs       : cAdvs,
                        page        : page,
                        status      : true,
                        reason      : ''

                    });return

                }).catch(function (err) {
                    console.log(err);
                    res.json({
                        status      : false,
                        reason      : 'خطا در اطلاعات ارسال'

                    });return
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
            limit:30
        }).then(function (cars) {
            res.json({
                cars        : cars,
                status      : true,
                reason      : ''

            });return
        }).catch(function () {
            res.json({
                status      : false,
                reason      : 'خطای داخلی سرور'

            });return
        })

    },
    businessGrsList:function(req,res){
        bt = (req.params.bt)*1 - 1;
        allType = res.daily.BusinessType;
        if ( typeof allType[bt] === 'undefined'  ) {

            res.json({
                status      : false,
                reason      : 'مقدار ورودی نامعتبر است'

            });return
        }
        else {
            businessGrs = allType[bt].BusinessGrs;
            res.json({
                businessGrs : businessGrs,
                status      : true,
                reason      : ''

            });return
        }

    },
    advComment:function(req,res){
        var form        = prInj.PrAll(req.body);
        var token = form.token
        people_id = form.id;
        now = new Date();
        var created_at = date.format(now, 'YYYY-MM-DD HH:mm:ss');
        Models.People.findOne({
            where:{
                id    : people_id,
                token : token
            }
        })
            .then(function (people) {
                    if(people){
                        peopleGinf = people;
                        Models.Comment.create({
                            people_id : people_id,
                            adv_id : form.adv_id,
                            text   : form.text,
                            name   : peopleGinf.name+' '+peopleGinf.family,
                            created_at : created_at,
                            updated_at : created_at,
                        }).then(function (row) {
                            res.json({
                                status      : true,
                                reason      : ''

                            });return
                        });
                    }
                    else {
                        res.json({
                            status      : false,
                            reason      : 'مقدار ورودی نامعتبر است'

                        });return
                    }
            })
            .catch(function (err) {
                res.json({
                    status      : false,
                    reason      : 'مقدار ورودی نامعتبر است'

                });return
            })


    },
    replyMsg:function(req,res){

        parent_id  = prInj.PrInj(req.body.msg_id);

        reply_text = prInj.PrInj(req.body.reply_text);

        var token = req.body.token
        people_id = req.body.id;

        Models.People.findOne({
            where:{
                id    : people_id,
                token : token
            }
        })
            .then(function (people) {
                if (people) {
                    peopleGinf = people;
                    Models.Comment.findOne({
                        where:{
                            id : parseInt(parent_id)
                        }
                    }).then(function (parent) {

                        if(parent){
                            now = new Date();
                            var created_at = date.format(now, 'YYYY-MM-DD HH:mm:ss');
                            Models.Comment.create({
                                people_id   : parent.people_id,
                                adv_id      : parent.adv_id,
                                parent_id   : parent.id,
                                name        : peopleGinf.name+' '+peopleGinf.family,
                                text        : reply_text,
                                created_at  : created_at,
                                updated_at  : created_at,
                            })
                            res.json({
                                status      : true,
                                reason      : ''

                            });return
                        }
                        else {
                            res.json({
                                status      : false,
                                reason      : 'مقدار ورودی نامعتبر است'

                            });return
                        }

                    }).catch(function (err) {
                        res.json({
                            status      : false,
                            reason      : 'مقدار ورودی نامعتبر است'

                        });return
                    })
                }
                else {
                    res.json({
                        status      : false,
                        reason      : 'مقدار ورودی نامعتبر است'

                    });return
                }
            }).catch(function () {
        
                res.json({
                    status      : false,
                    reason      : 'مقدار ورودی نامعتبر است'

                });return
            
        })
        

    },






























































    send:function(req,res){

            res.render('site/ads/chooseType',{res:res,jDate:jDate,needFul:needFul});

    },
    pay:function(req,res){

        var Amount       = 50000;
        var callbackURL  = 'https://saghfemardom.ir/pay/ch';
        var invoiceID    = res.peopleGinf.id;
        var terminalID   = 69003298;
        var payload      = {};
        var options = {
            url: 'https://mabna.shaparak.ir:8081/V1/PeymentApi/GetToken',
            method: 'POST',
            form: {
                Amount: Amount,
                callbackURL: callbackURL,
                invoiceID:invoiceID,
                terminalID:terminalID,
                payload:payload,
            }
        };

        function callback(error, response, body) {

            if (error){
                res.json({
                    status      : false,
                    reason      : 'خطا در اطلاعات ارسال'

                });return;return
            }
            if (!error && response.statusCode == 200) {
                gRes = JSON.parse(body);
                if ( gRes.Status == 0) {

                    token = gRes.AccessToken;
                    res.render('site/pages/pay', {token: token, res: res, jDate: jDate, needFul: needFul});
                }
            }
        }
       // payRequest(options, callback);
        token = 's';
        res.render('site/pages/pay', {token: token, res: res, jDate: jDate, needFul: needFul});


    },
    payCheck:function(req,res){
        payResult = req.body;
        if (payResult.amount == 50000){
            var digitalreceipt   = payResult.digitalreceipt;
            var Tid              = 69003298;
            var options = {
                url: 'https://mabna.shaparak.ir:8081/V1/PeymentApi/Advice',
                method: 'POST',
                form: {
                    digitalreceipt  : digitalreceipt,
                    Tid             : Tid
                }
            };

            function callback(error, response, body) {

                if (error){
                    res.json({
                    status      : false,
                    reason      : 'خطا در اطلاعات ارسال'

                });return;return
                }
                if (!error && response.statusCode == 200) {
                    gRes = JSON.parse(body);
                    if ( gRes.Status == 'Ok') {
                        now = new Date();
                        var created_at = date.format(now, 'YYYY-MM-DD HH:mm:ss');
                        Models.Payment.create({
                            people_id       : res.peopleGinf.id,
                            tracenumber     : payResult.tracenumber,
                            rrn             : payResult.rrn,
                            datePaid        : payResult.datePaid,
                            digitalreceipt  : payResult.digitalreceipt,
                            issuerbank      : payResult.issuerbank,
                            created_at      : created_at,
                            updated_at      : created_at,
                        }).then(function (row) {
                            req.session.people.credit = 50000;
                            Models.People.update({
                                credit : 50000
                            },{
                                where:{
                                    id : res.peopleGinf.id
                                }
                            });
                            res.render('site/pages/payCheck', {rrn: payResult.rrn, res: res, jDate: jDate, needFul: needFul});
                        })

                    }
                    else {
                        res.render('errors/500')
                    }
                }
            }
            payRequest(options, callback);
        }
        else {
            res.render('errors/404')
        }




    },
    editA:function(req,res){
            id = prInj.PrInj(req.params.id);
            Models.Adv.findOne({
                where:{
                    id:id
                },
                include:[
                    Models.AdvImage

                ]
            }).then(function (adv) {
                if (adv){
                    res.render('site/ads/editBusiness',{adv:adv,res:res,jDate:jDate,needFul:needFul});
                }
                else {
                    res.status(404);
                    res.json({
                    status      : false,
                    reason      : 'خطا در اطلاعات ارسال'

                });return
                }

            })
    },
    editC:function(req,res){
        id = prInj.PrInj(req.params.id);
        Models.CarAdv.findOne({
            where:{
                id:id
            },
            include:[
                Models.CarAdvImage

            ]
        }).then(function (adv) {
            if (adv){
                Models.Car.findAll({
                    where:{
                        $or:{
                            brand1_id: adv.brand,
                            brand2_id: adv.brand
                        }
                    }
                }).then(function (cars) {
                    if (adv.selling_type == 1 ){
                        res.render('site/ads/editCashCar',{cars:cars,adv:adv,res:res,jDate:jDate,needFul:needFul});
                    }
                    else {
                        res.render('site/ads/editInstCar',{cars:cars,adv:adv,res:res,jDate:jDate,needFul:needFul});
                    }
                })

            }
            else {
                res.status(404);
                res.json({
                    status      : false,
                    reason      : 'خطا در اطلاعات ارسال'

                });return
            }        })
    },
    changeAdvStat:function(req,res){
       inf = prInj.PrAll(req.params);
        dis_status = inf.status;
        id         = inf.id;

        now = new Date();
        var updated_at = date.format(now, 'YYYY-MM-DD HH:mm:ss');

        Models.Adv.update({
            dis_status : dis_status,
            updated_at : updated_at
        },{
            where:{
                id : id
            }
        }).then(function (r) {
            res.redirect(host+'/my');
        });

    },
    changeCarStat:function(req,res){

        inf = prInj.PrAll(req.params);
        dis_status = inf.status;
        id         = inf.id;

        now = new Date();
        var updated_at = date.format(now, 'YYYY-MM-DD HH:mm:ss');

        Models.CarAdv.update({
            dis_status : dis_status,
            updated_at : updated_at
        },{
            where:{
                id : id
            }
        }).then(function (r) {
            res.redirect(host+'/my');
        });

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
            bgRN           : prInj.PrInj( form.bgRN),
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
                        if(imgPath.length>5) {
                            newImg = {
                                adv_id: adv_id,
                                img_url: imgPath,
                                created_at: created_at,
                                updated_at: created_at
                            };
                            Models.AdvImage.create(newImg);
                        }
                                
                    }

        }).catch(function (err) {
            console.log(err);
                res.json( {status: false});return;
            });
    },
    updateAdv:function(req,res){
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
        newAdvInf = {
            user_id        : req.session.people.id,
            title          : prInj.PrInj( form.title),
            description    : prInj.PrInj( form.description),
            pro_id         : pro.id,
            pro_name       : pro.name,
            status         : 0,
            checked        : 0,
            city_id        : pro.cities[form.city].id,
            city_name      : pro.cities[form.city].name,
            business_type  : business_type,
            business_gr    : business_gr,
            video_url      : prInj.PrInj( form.videoPath),
            updated_at     : created_at
        }
        Models.Adv.update(newAdvInf,{
            where: {
                id: prInj.PrInj( form.id)
            }
            }).then(function(nRecord){
                Models.AdvImage.destroy({
                    where:{
                        adv_id: form.id
                    }
                }).then(function (r) {
                    for(i = 0;i<advImgs.length;i++){

                        newAdvImage(form.id,advImgs[i]);

                    }

                });
                    res.json({status:true});
                    function newAdvImage(adv_id,imgPath){
                        if(imgPath.length>5) {
                            newImg = {
                                adv_id: adv_id,
                                img_url: imgPath,
                                created_at: created_at,
                                updated_at: created_at
                            };
                            Models.AdvImage.create(newImg);
                        }

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
                                if(imgPath.length>5){
                                    newImg = {
                                        adv_id : adv_id,
                                        img_url: imgPath,
                                        created_at     : created_at,
                                        updated_at     : created_at
                                    };
                                    Models.CarAdvImage.create(newImg);
                                }

                                
                    }

        }).catch(function (err) {
            console.log(err);
                res.json( {status: false});return;
            });
    },
    updateCashCar:function(req,res){
        daily = res.daily;
        var form        = req.body;
        advImgs = form.advImgs;
        now = new Date();
        var created_at = date.format(now, 'YYYY-MM-DD HH:mm:ss');
        proC = daily.proCity;
        businesses = daily.BusinessType;
        pro = proC[form.pro];
        newAdvInf = {
            title          : prInj.PrInj( form.title),
            description    : prInj.PrInj( form.description),
            brand          : prInj.PrInj( form.brand),
            model          : prInj.PrInj( form.model),
            price          : prInj.PrInj( form.price),
            pro_id         : pro.id,
            pro_name       : pro.name,
            status         : 0,
            checked        : 0,
            city_id        : pro.cities[form.city].id,
            city_name      : pro.cities[form.city].name,
            delivery_time  : prInj.PrInj( form.delivery_time),
            video_url      : prInj.PrInj( form.videoPath),
            updated_at     : created_at
        }
        Models.CarAdv.update(newAdvInf,{
            where: {
                id: prInj.PrInj( form.id)
            }
        }).then(function(nRecord){
            Models.CarAdvImage.destroy({
                where:{
                    adv_id: form.id
                }
            }).then(function (r) {
                for(i = 0;i<advImgs.length;i++){

                    newCarAdvImage(form.id,advImgs[i]);

                }

            });

            res.json({status:true});
            function newCarAdvImage(adv_id,imgPath){
                if(imgPath.length>5) {
                    newImg = {
                        adv_id: adv_id,
                        img_url: imgPath,
                        created_at: created_at,
                        updated_at: created_at
                    };
                    Models.CarAdvImage.create(newImg);
                }

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
                        if(imgPath.length>5) {
                            newImg = {
                                adv_id: adv_id,
                                img_url: imgPath,
                                created_at: created_at,
                                updated_at: created_at
                            };
                            Models.CarAdvImage.create(newImg);
                        }

                    }

        }).catch(function (err) {
            console.log(err);
                res.json( {status: false});return;
            });
    },
    updateInstCar:function(req,res){
        daily = res.daily;
        var form        = req.body;
        advImgs = form.advImgs;
        now = new Date();
        var created_at = date.format(now, 'YYYY-MM-DD HH:mm:ss');
        proC = daily.proCity;
        businesses = daily.BusinessType;
        pro = proC[form.pro];
        newAdvInf = {
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
            status         : 0,
            checked        : 0,
            city_id        : pro.cities[form.city].id,
            city_name      : pro.cities[form.city].name,
            video_url      : prInj.PrInj( form.videoPath),
            updated_at     : created_at
        }
        Models.CarAdv.update(newAdvInf,{
            where: {
                id: prInj.PrInj( form.id)
            }
        }).then(function(nRecord){

            Models.CarAdvImage.destroy({
                where:{
                    adv_id: form.id
                }
            }).then(function (r) {
                for(i = 0;i<advImgs.length;i++){

                    newCarAdvImage(form.id,advImgs[i]);

                }

            });
            res.json({status:true});
            function newCarAdvImage(adv_id,imgPath){
                if(imgPath.length>5) {
                    newImg = {
                        adv_id: adv_id,
                        img_url: imgPath,
                        created_at: created_at,
                        updated_at: created_at
                    };
                    Models.CarAdvImage.create(newImg);
                }

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
            res.json({
                    status      : false,
                    reason      : 'مقدار ورودی نامعتبر است'

                });return;
        })
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
        Models.CarAdvImage.destroy({
            where:{
                img_url: file
            }
        });
        Models.AdvImage.destroy({
            where:{
                img_url: file
            }
        });
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






    




};

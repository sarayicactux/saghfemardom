const path          = require('path');
const url           = require('url');
const date          = require('date-and-time');
const Password      = require("node-php-password");
const speakeasy     = require('speakeasy');
var prInj = require('../helpers/prInj');
var jDate = require('../helpers/jDate');
var Models = require('../models/Models');
var User   = require('../models/User');



module.exports = {

    login: function (req,res) {

        if (!req.session.user){
            res.render('user/login',{
                error: '',
            });
        }
        else {
            user = req.session.user;
            if (user.id == 1){
                res.redirect('/panel/admin');

            }
            else {
                if (user.aType == 2){
                    res.redirect('/panel/author');
                }
                else{
                    res.redirect('/');
                }

            }

        }

    },
    checkLogin: function (req,res) {

        var pass        = prInj.PrInj(req.body.password);
        var email    = prInj.PrInj(req.body.email);
        Models.User.findOne({
            where:{email:email}
        }).then(function (row) {
            if (row.length != 0){

                if (Password.verify(pass, row.password)){

                    req.session.user = row;

                    //req.session.save();
                    req.session.otp = 'set';
                    res.redirect('/panel');
                    // res.render('user/otp');


                }
                else {
                    res.redirect('/panel');
                }
            }

            else {
                res.redirect('/panel');
            }
        })
            .catch(function (err) {
                res.render('errors/500');
                return;
            })


    },
    checkOtp:function(req,res){



        if (!req.session.user){
            res.json({status:false});
        }
        else if (!req.headers['x-otp']){
            res.json({status:false});
        }
        else {
            otp = req.headers['x-otp'];
            user = req.session.user;
            console.log(user.secret);
            var verified = speakeasy.totp.verify({
                secret: user.secret,
                encoding: 'base32',
                token: otp
            });
            if(verified){
                req.session.otp = 'set';
                res.json({status:true});
            } else {
                res.json({status:false});
            }



        }

    },
    landing:function(req,res){

            user = req.session.user;

            if (user.id == 1){
                res.redirect('/panel/admin');

            }
            else {
                if (user.aType == 2){
                    res.redirect('/panel/author');
                }
                else{
                    res.redirect('/');
                }


            }


    },
    logOut:function (req,res) {
        req.session.destroy();
        res.redirect('/');
    }



};
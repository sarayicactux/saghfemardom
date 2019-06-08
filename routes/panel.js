const express     = require('express');
const urlencode   = require('urlencode');
const date        = require('date-and-time');

var user            = require('../controllers/user');
const router        = express.Router();
const jsonfile      = require('jsonfile');
const path          = require('path');
var prInj           = require('../helpers/prInj');


router.route('/').get(user.login);
router.route('/checkLogin').post(user.checkLogin);
router.route('/checkOtp').post(user.checkOtp);
router.route('/landing').get(landing,user.landing);
router.route('/logOut').get(user.logOut);





//export this router to use in our index.js
function landing(req,res,next){
    if (!req.session.user){
        res.redirect('/panel');
        return;
    }
    else {
        if(!req.session.otp){
            res.redirect('/panel/logOut');
            return;
        }
        else {
           next();

        }

    }
}
module.exports = router;
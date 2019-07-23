const smsRequest    = require('request');
const hasher        = require("node-php-password");

module.exports = {


    Commafy: function (num) {

        var str = num.toString().split('.');
        if (str[0].length >= 5) {
            str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
        }
        if (str[1] && str[1].length >= 5) {
            str[1] = str[1].replace(/(\d{3})/g, '$1 ');
        }
        return str.join('.');

    },
    menuAccess:function(module_id){

            mod =  modules.indexOf(module_id)
            return access[mod];

    },
    tokenCreator:function(){
        var val = Math.floor(10000000 + Math.random() * 90000000);
        now = new Date();
        token = hasher.hash(now+ val);
        return token;
    },
    sendSmsCode:function (mobile) {
		mobile = toInt(mobile);
        var val = Math.floor(1000 + Math.random() * 9000);
        var token        = val;
        var receptor     = mobile;
        var template     = 'saghf';
        var type         = 'sms';
        var options = {
            url: 'https://api.kavenegar.com/v1/785649594935524D732F666F7970474C7A312B61425355454558302B6335302F3373353135796364366A303D/verify/lookup.json',
            method: 'POST',
            form: {
                token: token,
                receptor: receptor,
                template:template,
                type:type,
            }
        };

        function callback(error, response, body) {


        }
        smsRequest(options, callback);
        return val;

    },
    /*
    sendSmsCode:function (mobile) {

        var val = Math.floor(1000 + Math.random() * 9000);
        var method       = 'sendsms';
        var from         = 50004007;
        var to           = mobile;
        var text         = 'کد احراز هویت شما : '+val;
        var type         = 0;
        var username     = 'saghfemardom';
        var password     = 'e455933ffefad1a167466726fe3a42e0';
        var options = {
            url: 'http://185.112.33.60/webservice/url/send.php',
            method: 'POST',
            form: {
                method: method,
                from: from,
                to:to,
                text:text,
                type:type,
                username:username,
                password:password,
            }
        };

        function callback(error, response, body) {


        }
        smsRequest(options, callback);
        return val;

    },*/
    sendPassSmsCode:function (mobile) {
		mobile = toInt(mobile);
        var val = Math.floor(100000 + Math.random() * 900000);
        var token        = val;
        var receptor     = mobile;
        var template     = 'saghf2';
        var type         = 'sms';
        var options = {
            url: 'https://api.kavenegar.com/v1/785649594935524D732F666F7970474C7A312B61425355454558302B6335302F3373353135796364366A303D/verify/lookup.json',
            method: 'POST',
            form: {
                token: token,
                receptor: receptor,
                template:template,
                type:type,
            }
        };

        function callback(error, response, body) {


        }
        smsRequest(options, callback);
        return val;

    },
    checkMime:function(filename,type){
        check = true;
        if(type == 1){
            mimeList = ['jpg','jpeg','png'];
        }
        else if(type == 2){
            mimeList = ['mp4','MP4'];
        }
        var i = filename.lastIndexOf('.');
        memeType = filename.substr(i+1);

        checkMime = mimeList.indexOf(memeType);
        if (checkMime == -1)check = false;
        return check

    },
    toInt:function(str){
        str = str.replace(/٠/g,'0');
        str = str.replace(/١/g,'1');
        str = str.replace(/٢/g,'2');
        str = str.replace(/٣/g,'3');
        str = str.replace(/٤/g,'4');
        str = str.replace(/٥/g,'5');
        str = str.replace(/٦/g,'6');
        str = str.replace(/٧/g,'7');
        str = str.replace(/٨/g,'8');
        str = str.replace(/٩/g,'9');
        str = str.replace(/۰/g,'0');
        str = str.replace(/۱/g,'1');
        str = str.replace(/۲/g,'2');
        str = str.replace(/۳/g,'3');
        str = str.replace(/۴/g,'4');
        str = str.replace(/۵/g,'5');
        str = str.replace(/۶/g,'6');
        str = str.replace(/۷/g,'7');
        str = str.replace(/۸/g,'8');
        str = str.replace(/۹/g,'9');
        return str;
    }


};
function toInt(str) {
    str = str.replace(/٠/g,'0');
    str = str.replace(/١/g,'1');
    str = str.replace(/٢/g,'2');
    str = str.replace(/٣/g,'3');
    str = str.replace(/٤/g,'4');
    str = str.replace(/٥/g,'5');
    str = str.replace(/٦/g,'6');
    str = str.replace(/٧/g,'7');
    str = str.replace(/٨/g,'8');
    str = str.replace(/٩/g,'9');
	str = str.replace(/۰/g,'0');
    str = str.replace(/۱/g,'1');
    str = str.replace(/۲/g,'2');
    str = str.replace(/۳/g,'3');
    str = str.replace(/۴/g,'4');
    str = str.replace(/۵/g,'5');
    str = str.replace(/۶/g,'6');
    str = str.replace(/۷/g,'7');
    str = str.replace(/۸/g,'8');
    str = str.replace(/۹/g,'9');
    return str;
}



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
    sendSmsCode:function (mobile) {

        var val = Math.floor(1000 + Math.random() * 9000);
        console.log(val);
        return val;
    },
    checkMime(filename,type){
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

    }


};
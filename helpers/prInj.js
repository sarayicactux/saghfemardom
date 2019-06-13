module.exports = {


    PrInj: function (str) {
        console.log(str);
        return PrInj(str);

    },
    PrAll:function (request) {
        var rt = {};

        keys = Object.keys(request);
        values = Object.values(request);
        for(i=0;i<keys.length;i++){
            val = PrInj(values[i]);
            rt[keys[i]] = val;
        }

        return rt;
    }


};
function  PrInj(str) {
    if (str){
        str = str.replace(/"/g,'');
        str = str.replace(/'/g,'');
        str = str.replace(/;/g,'');
        str = str.replace(/`/g,'');

    }
    return str;

}
const request       = require('../configs/mod-config');
const jsonfile      = require('jsonfile');
const path          = require('path');
var Models          = require('../models/Models');

var prInj = require('../helpers/prInj');

module.exports = {


    daily: function (req,res) {
        const file = path.resolve()+'/public/daily.json';

        var Myjson = {
            'staticContent' : res.staticContent,
            'proCity'       : res.pros,
            'brands'        : res.brands,
            'cars'          : res.cars,
            'BusinessType'  : res.BusinessType,

        };
        jsonfile.writeFile(file, Myjson,{ spaces: 2, EOL: '\r\n' });
        res.end();

    },

    hourly: function (req,res) {res.end();}


};
var sequelize = require('../configs/seq-config');
// define Models

const CarAdvImage           = require('../models/sequelize/CarAdvImage');
const CarAdv                = require('../models/sequelize/CarAdv');
const AdvImage              = require('../models/sequelize/AdvImage');
const Adv                   = require('../models/sequelize/Adv');
const BusinessType          = require('../models/sequelize/BusinessType');
const BusinessGr            = require('../models/sequelize/BusinessGr');
const CarImage              = require('../models/sequelize/CarImage');
const Car                   = require('../models/sequelize/Cars');
const Brand1                = require('../models/sequelize/Brand1');
const Brand2                = require('../models/sequelize/Brand2');
const User                  = require('../models/sequelize/User');
const News                  = require('../models/sequelize/News');
const NewsGr                = require('../models/sequelize/NewsGr');
const PagesLog              = require('../models/sequelize/PagesLog');
const Comment               = require('../models/sequelize/Comment');
const CommentLikeDislike    = require('../models/sequelize/CommentLikeDislike');
const UserLog               = require('../models/sequelize/UserLog');
const People                = require('../models/sequelize/People');
const ProCity               = require('../models/sequelize/ProCity');




// define relations
User.hasMany(UserLog,{foreignKey:'user_id'});
UserLog.belongsTo(User,{foreignKey:'user_id'});

Brand1.hasMany(Car,{foreignKey: 'brand1_id'});
Car.belongsTo(Brand1,{foreignKey: 'brand1_id'});

Brand2.hasMany(Car,{foreignKey: 'brand2_id'});
Car.belongsTo(Brand2,{foreignKey: 'brand2_id'});

Car.hasMany(CarImage,{foreignKey: 'car_id'});
CarImage.belongsTo(Car,{foreignKey: 'car_id'});

NewsGr.hasMany(News,{foreignKey: 'gr_id'});
News.belongsTo(NewsGr,{foreignKey: 'gr_id'});

Comment.hasMany(CommentLikeDislike,{foreignKey: 'comment_id'});
CommentLikeDislike.belongsTo(Comment,{foreignKey: 'comment_id'});

Comment.hasMany(Comment,{foreignKey:'parent_id'});
Comment.belongsTo(Comment,{foreignKey:'parent_id'});

BusinessType.hasMany(BusinessGr,{foreignKey:'business_type_id'});
BusinessGr.belongsTo(BusinessType,{foreignKey:'business_type_id'});

BusinessType.hasMany(People,{foreignKey:'business_type'});
People.belongsTo(BusinessType,{foreignKey:'business_type'});

BusinessGr.hasMany(People,{foreignKey:'business_gr'});
People.belongsTo(BusinessGr,{foreignKey:'business_gr'});

BusinessGr.hasMany(Adv,{foreignKey:'business_gr'});
Adv.belongsTo(BusinessGr,{foreignKey:'business_gr'});

ProCity.hasMany(Adv,{foreignKey:'pro_id'});
Adv.belongsTo(ProCity,{foreignKey:'pro_id'});

Adv.hasMany(AdvImage,{foreignKey:'adv_id'});
AdvImage.belongsTo(Adv,{foreignKey:'adv_id'});

People.hasMany(Adv,{foreignKey:'user_id'});
Adv.belongsTo(People,{foreignKey:'user_id'});

Brand1.hasMany(CarAdv,{foreignKey:'brand'});
CarAdv.belongsTo(Brand1,{foreignKey:'brand'});

Car.hasMany(CarAdv,{foreignKey:'model'});
CarAdv.belongsTo(Car,{foreignKey:'model'});

CarAdv.hasMany(CarAdvImage,{foreignKey:'adv_id'});
CarAdvImage.belongsTo(CarAdv,{foreignKey:'adv_id'});

People.hasMany(CarAdv,{foreignKey:'user_id'});
CarAdv.belongsTo(People,{foreignKey:'user_id'});




// create Models OBJ
var Models = {} ;
Models.CarAdvImage  = CarAdvImage;
Models.CarAdv       = CarAdv;
Models.AdvImage     = AdvImage;
Models.Adv          = Adv;
Models.BusinessType = BusinessType;
Models.BusinessGr   = BusinessGr;
Models.NewsGr       = NewsGr;
Models.CarImage     = CarImage;
Models.Car          = Car;
Models.Brand1       = Brand1;
Models.Brand2       = Brand2;
Models.User         = User;
Models.News         = News;
Models.PagesLog     = PagesLog;
Models.Comment      = Comment;
Models.People       = People;
Models.ProCity      = ProCity;
Models.CommentLikeDislike     = CommentLikeDislike;




module.exports = Models;
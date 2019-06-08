var express = require('express');


var router = express.Router();

router.route('/').get(start.start);


//export this router to use in our index.js
module.exports = router;
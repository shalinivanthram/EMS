var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {
  //res.send('respond with a resource');
	res.render("listEmployees.ejs");
});

module.exports = router;

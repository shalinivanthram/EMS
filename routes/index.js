var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'EMS Login' });
});

router.get("/signUp", function(req,res){
	res.render("signUp");
});

module.exports = router;

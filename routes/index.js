var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'EMS Login' });
});

router.get("/signUp", function(req,res){
	res.render("signUp");
});
router.post("/empSingUp", function(req,res){
	emp.createEmp(req, res);
});

module.exports = router;

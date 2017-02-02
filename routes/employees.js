var express = require('express');
var router = express.Router();
var mongo = require('../lib/mongo');

/* GET users listing. */
router.post('/', function(req, res, next) {
  //res.send('respond with a resource');
  var Employee = mongo.Employee;
  var username = req.body.username;
  var password = req.body.password;
  console.log("Username: "+username+ " and Password: "+password);
  Employee.findOne({username:username,password:password}, function (err, employees) {
    if (!err && employees) {
        console.log("Employee List:"+JSON.stringify(employees));
        res.render("listEmployees");
    }else{
        res.redirect('/');
    }
    
  });
});

module.exports = router;

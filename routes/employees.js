var express = require('express');
var router = express.Router();
var mongo = require('../lib/mongo');
var emp = require('../controller/employee');

/* GET users listing. */
router.post('/login', function(req, res, next) {
    require('passport').authenticate('local', {failureRedirect: '/?error=error.login_error'})(req, res, next);
}, function(req, res, next) {
    res.redirect("/employees/listEmployees");
});

router.get('/logout', function(req, res, next) {
    req.logout();
    res.redirect('/?message=info.loggedout');
});

router.post("/empSignUp", function(req,res){
	emp.createEmp(req, res);
});

//edit employee using username
router.get('/editEmp', function(req, res){
    var responsetype = req.query.responsetype;
	if(req.query.username === null || req.query.username === ''){
		console.log('no user name to retrieve');
		//redirect to error page
		res.render('/viewEmployee?error=error.editEmp.invalidUserName');
	} else {
            console.log("going to get emp details");
            emp.getEmployee(req, res, function(error, result){
                if(responsetype==='json'){
                res.json(result);
                }else{
                    res.render("viewEmployee", {employee: result});
                }
            });
	}
});

router.get('/getEmployeeList', function(req, res, next) {
    
    emp.getEmployeeList(req, res);
    
});

router.post("/updateEmp", function(req,res){
	emp.updateEmp(req, res, function(error, result){
            if(result.status === "Success"){
                res.redirect("/employees/listEmployees");
            }
        });
        
        
});
router.get('/listEmployees', function(req, res, next) {
    res.render('listEmployees');
});
router.get('/deleteEmp', function(req, res, next) {
	emp.delEmp(req, res, function(error, result){
            if(result.status === "Success"){
                res.redirect("/employees/listEmployees");
            }
        });
});

module.exports = router;

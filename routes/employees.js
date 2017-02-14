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
    var isAdmin = req.body.isAdmin;
    if(isAdmin){
            isAdmin = 'Y';
    } else {
            isAdmin = 'N';
    }
    
    var newEmp = {
        "firstName" : req.body.firstName,
        "lastName" : req.body.lastName,
        "email" : req.body.email,
        "phone" : req.body.phone,
        "doj" : req.body.doj,
        "isAdmin" : isAdmin,
        "username" : req.body.userName,
        "password" : req.body.password,
    };
    emp.createEmp(newEmp, function(error, result){
        var status = result.status;
        if(status === 'success'){
            res.redirect('/');
        } else if(status === 'userExists'){
            res.redirect('/?error=error.user_exists');
        }else {
            res.redirect('/?error=error.signUp_error');
        }
    });
});

//edit employee using username
router.get('/editEmp', function(req, res){
    var responsetype = req.query.responsetype;
    var username = req.query.username;
	if(username){
            console.log("going to get emp details");
            emp.getEmployee(username, function(error, result){
                if(responsetype==='json'){
                res.json(result);
                }else{
                    res.render("viewEmployee", {employee: result});
                }
            });
		
	} else {
            console.log('no user name to retrieve');
            //redirect to error page
            res.render('/viewEmployee?error=error.editEmp.invalidUserName');
	}
});

router.get('/getEmployeeList', function(req, res, next) {
    var paramName = req.query.paramName;
    var paramValue = req.query.paramValue;
    var username = req.user.username;
    var isAdmin = req.user.isAdmin;
    var searchObj = {"paramName" : paramName, "paramValue" : paramValue, "username" : username, "isAdmin" : isAdmin};
    emp.getEmployeeList(searchObj, function(err, result){
        console.log("final result: " + result);
        res.json(result);
    });
    
});

router.post("/updateEmp", function(req,res){
    var employee =req.body;

    emp.updateEmp(employee, function(error, result){
        if(result.status === "Success"){
            res.redirect("/employees/listEmployees");
        }
    });      
        
});
router.get('/listEmployees', function(req, res, next) {
    res.render('listEmployees');
});
router.get('/deleteEmp', function(req, res, next) {
    var userName = req.query.username;
	emp.delEmp(userName, function(error, result){
            if(result.status === "Success"){
                res.redirect("/employees/listEmployees");
            }
        });
});

module.exports = router;

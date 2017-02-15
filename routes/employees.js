'use strict';

var express = require('express');
var router = express.Router();
var mongo = require('../lib/mongo');
var emp = require('../controller/employee');

/* GET users listing. */
router.post('/login', function (req, res, next) {
    require('passport').authenticate('local', {failureRedirect: '/?error=error.login_error'})(req, res, next);
}, function (req, res) {
    console.log("Request Body :" + req);
    res.redirect("/employees/listEmployees");
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/?message=info.loggedout');
});

router.post("/empSignUp", function (req, res) {
    var isAdmin = req.body.isAdmin,
        newEmp = {
            "firstName": req.body.firstName,
            "lastName": req.body.lastName,
            "email": req.body.email,
            "phone": req.body.phone,
            "doj": req.body.doj,
            "isAdmin": isAdmin,
            "username": req.body.userName,
            "password": req.body.password
        };
    if (isAdmin) {
        isAdmin = 'Y';
    } else {
        isAdmin = 'N';
    }
    newEmp.isAdmin = isAdmin;
    emp.createEmp(newEmp, function (error, result) {
        var status = result.status;
        if (error) {
            res.redirect('/?error=error.signUp_error');
        } else if (status === 'success') {
            res.redirect('/');
        } else if (status === 'userExists') {
            res.redirect('/?error=error.user_exists');
        } else {
            res.redirect('/?error=error.signUp_error');
        }
    });
});

//edit employee using username
router.get('/editEmp', function (req, res) {
    var responsetype = req.query.responsetype,
        username = req.query.username;
    if (username) {
        console.log("going to get emp details");
        emp.getEmployee(username, function (error, result) {
            if (!error) {
                if (responsetype === 'json') {
                    res.json(result);
                } else {
                    res.render("viewEmployee", {employee: result});
                }
            }
        });

    } else {
        console.log('no user name to retrieve');
        //redirect to error page
        res.render('/viewEmployee?error=error.editEmp.invalidUserName');
    }
});

router.get('/getEmployeeList', function (req, res) {
    var paramName = req.query.paramName,
        paramValue = req.query.paramValue,
        username = req.user.username,
        isAdmin = req.user.isAdmin,
        searchObj = {"paramName": paramName, "paramValue": paramValue, "username": username, "isAdmin": isAdmin};
    emp.getEmployeeList(searchObj, function (err, result) {
        if (!err) {
            console.log("final result: " + result);
            res.json(result);
        }
    });

});

router.post("/updateEmp", function (req, res) {
    var employee = req.body;

    emp.updateEmp(employee, function (error, result) {
        if (result.status === "Success" && (!error)) {
            res.redirect("/employees/listEmployees");
        }
    });

});
router.get('/listEmployees', function (req, res) {
    console.log("Request Body :" + req);
    res.render('listEmployees');
});
router.get('/deleteEmp', function (req, res) {
    var userName = req.query.username;
    emp.delEmp(userName, function (error, result) {
        if (result.status === "Success" && (!error)) {
            res.redirect("/employees/listEmployees");
        }
    });
});

module.exports = router;

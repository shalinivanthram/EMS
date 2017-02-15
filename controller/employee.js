/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

var mongo = require("../lib/mongo");
var Employee = mongo.Employee;
var moment = require('moment');

var createEmp = function (newEmp, callback) {

    Employee.findOne({'username': newEmp.username}).exec(function (err, employee) {
        if (err) {
            //console.log("err: " + err);
            callback(null, {"status": "failed"});
        } else if (employee !== null) {
            //console.log("user already exists");
            callback(null, {"status": "userExists"});
        } else {
            //create a new user./controller
            employee = new Employee(newEmp);
            employee.save(function (err) {
                if (err) {
                    callback(null, {"status": "failed"});
                } else {
                    callback(null, {"status": "success"});
                }
            });
        }
    });

};

var getEmployee = function (username, callback) {
    console.log("Username:" + username);
    Employee.findOne({'username': username}).exec(function (err, employee) {
        if (err) {
            console.log("err: " + err);
            //return res.send();
        } else if (employee === null) {
            console.log("username does not exist");
            callback(null, null);
        } else {
            //res.setHeader('Content-Type', 'application/json');
            var emp = {
                "firstName": employee.firstName,
                "lastName": employee.lastName,
                "userName": employee.username,
                "password": employee.password,
                "email": employee.email,
                "phone": employee.phone,
                "isAdmin": employee.isAdmin,
                //"doj": employee.doj
                "doj": moment(employee.doj).format('MM/DD/YYYY')
            };
            //res.json(emp);
            console.log("Employee Record 1:" + JSON.stringify(emp));
            callback(null, emp);
        }
    });
};

var getEmployeeList = function (searchObj, callback) {

    var employeesJSON = {},
        employeesData = [],
        paramName = searchObj.paramName,
        paramValue = searchObj.paramValue,
        options = {},
        username = searchObj.username,
        isAdmin = searchObj.isAdmin;
    if (paramName && paramValue) {
        options[paramName] = {'$regex': paramValue, $options: 'i'};
    }
    console.log("Username :" + JSON.stringify(searchObj.username));

    Employee.find(options).exec(function (err, employees) {
        if (err) {
            console.log("err: " + err);
        } else if (employees !== null) {
            employees.forEach(function (emp) {
                console.log("Employee :" + JSON.stringify(emp));
                var employee = [],
                    actions = '<a class="btn btn-success" onclick="getEmp(\'' + emp.username + '\');"><i class="glyphicon glyphicon-zoom-in icon-white"></i>View</a>';
                employee.push(emp.firstName + " " + emp.lastName);
                employee.push(emp.email);
                employee.push(emp.phone);
                //employee.push(emp.doj.toString());
                if (emp.doj) {
                    employee.push(moment(emp.doj).format('MM/DD/YYYY'));
                } else {
                    console.log("found empty sting for user name: " + emp.username);
                    employee.push("");
                }
                if (isAdmin === 'Y') {
                    actions = '<a class="btn btn-success" style="margin-right:5px;" onclick="getEmp(\'' + emp.username + '\');"><i class="glyphicon glyphicon-zoom-in icon-white"></i>View</a>' +
                        '<a class="btn btn-info" style="margin-right:5px;" href="/employees/editEmp?username=' + emp.username + '"><i class="glyphicon glyphicon-edit icon-white"></i>Edit</a>' +
                        '<a class="btn btn-danger" href="/employees/deleteEmp?username=' + emp.username + '"><i class="glyphicon glyphicon-trash icon-white"></i>Delete</a>';
                }
                if (emp.username === username) {
                    actions = '<a class="btn btn-success" style="margin-right:5px;" onclick="getEmp(\'' + emp.username + '\');"><i class="glyphicon glyphicon-zoom-in icon-white"></i>View</a>' +
                        '<a class="btn btn-info" href="/employees/editEmp?username=' + emp.username + '"><i class="glyphicon glyphicon-edit icon-white"></i>Edit</a>';
                }

                console.log("Employee :" + employee);
                employee.push(actions);
                employeesData.push(employee);
            });
            employeesJSON.DATA = employeesData;
            callback(null, employeesJSON);
            // return employeesJSON;
        }
    });
};

var updateEmp = function (emp, callback) {
    console.log('from req: ' + emp.isAdmin);
    var userName = emp.userName,
        isAdmin = emp.isAdmin;
    if (!isAdmin) {
        isAdmin = 'N';
    } else {
        isAdmin = 'Y';
    }
    console.log('after change: ' + isAdmin);
    Employee.findOne({'username': userName}).exec(function (err, employee) {
        if (err) {
            console.log("err: " + err);
        } else if (employee === null) {
            console.log("username does not exist");
        } else {
            //update employee with new values
            employee.firstName = emp.firstName;
            employee.lastName = emp.lastName;
            employee.email = emp.email;
            employee.phone = emp.phone;
            employee.doj = emp.doj;
            employee.isAdmin = isAdmin;
            employee.password = emp.password;

            employee.save(function (err, updatedEmp) {
                if (err) {
                    return err;
                }
                console.log("Emp update Successful:" + JSON.stringify(updatedEmp));
                //res.json({"status":"Success"});
                callback(null, {"status": "Success"});
            });
        }
    });


};

var delEmp = function (userName, callback) {

    Employee.findOne({'username': userName}).exec(function (err, employee) {
        if (err) {
            console.log("err: " + err);
        } else if (employee === null) {
            console.log("username does not exist");
        } else {
            console.log("going to del");
            employee.remove(function (err) {
                if (err) {
                    callback(err, null);
                } else {
                    //res.json({"status":"Success"});
                    callback(null, {"status": "Success"});
                }
            });
        }
    });
};

exports.delEmp = delEmp;
exports.updateEmp = updateEmp;
exports.createEmp = createEmp;
exports.getEmployee = getEmployee;
exports.getEmployeeList = getEmployeeList;
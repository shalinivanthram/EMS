/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var mongo = require("../lib/mongo");
var Employee = mongo.Employee;

var createEmp = function(req, res){
	var firstName = req.body.fistName;
	var lastName = req.body.lastName;
	var email = req.body.email;
	var phone = req.body.phone;
	var doj = req.body.doj;
	var isAdmin = req.body.isAdmin;
	var userName = req.body.userName;
	var password = req.body.password;
	
	if(isAdmin === null || isAdmin === ''){
		isAdmin = 'N';
	} else {
		isAdmin = 'Y;'
	}
	
	var user = {
			firstName: firstName,
            lastName:lastName,
            username:userName,
            password:password,
            email:email,
            phone:phone,
            isAdmin:isAdmin,
            doj:doj
	}
	
	var employee = new Employee();
	
	Employee.findOne({'username' : userName}).exec(function (err, employee) {
	  if(err){
		  console.log("err: " + err);
	  } else if( employee != null){
		  console.log("user already exists");
	  } else {
		  //create a new user
		  employee = new Employee(user);
			employee.save(function (err) {
			  if (err) {
					return err;
			  }
			  else {
			  	console.log("Emp saved");
			  	//res.render();
			  }
			});
	  }
	});

};

exports.createEmp = createEmp;

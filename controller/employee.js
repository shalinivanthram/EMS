/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var mongo = require("../lib/mongo");
var Employee = mongo.Employee;

var createEmp = function(req, res){
	var firstName = req.body.firstName;
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

var getEmployee = function(req, res){
	var username = req.query.username;
	
	Employee.findOne({'username' : username}).exec(function (err, employee) {
	  if(err){
		  console.log("err: " + err);
	  } else if( employee === null){
		  console.log("username does not exist");
	  } else {
		  //res.setHeader('Content-Type', 'application/json');
		  var emp = {"firstName": employee.firstName,
				  	 "lastName":employee.lastName,
				  	 "userName":employee.username,
				  	 "password": employee.password,
				  	 "email":employee.email,
				  	 "phone":employee.phone,
				  	 "isAdmin":employee.isAdmin,
				  	 "doj":employee.doj
				  	};
		  console.log(JSON.stringify(emp));
		  res.render("viewEmployee", {employee: emp});
	  }
	});
}

/*var updateEmp = function(req, res){
	var firstName = req.body.firstName;
	var lastName = req.body.lastName;
	var email = req.body.email;
	var phone = req.body.phone;
	var doj = req.body.doj;
	var isAdmin = req.body.isAdmin;
	var userName = req.body.userName;
	var password = req.body.password;
	
	Employee.findOne({'username' : userName}).exec(function (err, employee) {
		  if(err){
			  console.log("err: " + err);
		  } else if( employee === null){
			  console.log("username does not exist");
		  } else {
			  //update employee with new values
			  employee.firstName = req.body.firstName;
			  employee.lastName = req.body.lastName;
			  employee.email = req.body.email;
			  employee.phone = req.body.phone;
			  employee.doj = req.body.doj;
			  employee.isAdmin = req.body.isAdmin;
			  employee.password = req.body.password;
				
			  employee.save(function (err) {
				  if (err) {
						return err;
				  }
				  else {
				  	console.log("Emp update Successful");
				  	//res.render();
				  }
			  });
		  }
		});*/
	
	
};

exports.updateEmp = updateEmp;
exports.createEmp = createEmp;
exports.getEmployee = getEmployee;

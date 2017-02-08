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
		isAdmin = 'Y';
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

var getEmployeeList = function(req, res){
    
    var employeesJSON = {};
    var employeesData = [];
    var paramName = req.query.paramName;
    var paramValue = req.query.paramValue;
    var options = {};
    if(paramName && paramValue){
        options[paramName] = {'$regex': paramValue,$options:'i'};
    }
    console.log("Username :"+JSON.stringify(req.user));
    var username = req.user.username;
    var isAdmin = req.user.isAdmin;
    Employee.find(options).exec(function (err, employees) {
        if(err){
                console.log("err: " + err);
        } else if( employees != null){
              employees.forEach(function(emp) {
                  console.log("Employee :"+JSON.stringify(emp));
                  var employee = [];
                  employee.push(emp.firstName+" "+emp.lastName);
                  employee.push(emp.email);
                  employee.push(emp.phone);
                  employee.push(emp.doj.toString());
                  var actions = '<a class="btn btn-success" href="#"><i class="glyphicon glyphicon-zoom-in icon-white"></i>View</a>';
                  if(isAdmin==='Y'){
                      actions = '<a class="btn btn-success" href="#"><i class="glyphicon glyphicon-zoom-in icon-white"></i>View</a>'+
                                '<a class="btn btn-info" href="/employees/editEmp?username='+emp.username+'"><i class="glyphicon glyphicon-edit icon-white"></i>Edit</a>'+
                                '<a class="btn btn-danger" href="#"><i class="glyphicon glyphicon-trash icon-white"></i>Delete</a>';
                  }
                  if(emp.username===username){
                      actions = '<a class="btn btn-success" href="#"><i class="glyphicon glyphicon-zoom-in icon-white"></i>View</a>'+
                                '<a class="btn btn-info" href="/employees/editEmp?username='+emp.username+'"><i class="glyphicon glyphicon-edit icon-white"></i>Edit</a>';
                  }
                  
                  console.log("Employee :"+employee);
                  employee.push(actions);
                  employeesData.push(employee);
              });
              employeesJSON["DATA"] = employeesData;
              res.json(employeesJSON);
        }
    });
}
var updateEmp = function(req, res){
	var userName = req.body.userName;
	var isAdmin = req.body.isAdmin;
	console.log('from req: ' + isAdmin);
	
	if(isAdmin == null || isAdmin === '' || (isAdmin != null && isAdmin.toLowerCase() == 'undefined')){
		isAdmin = 'N';
	} else {
		isAdmin = 'Y';
	}
	console.log('after change: ' + isAdmin);
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
			  employee.isAdmin = isAdmin;
			  employee.password = req.body.password;
				
			  employee.save(function (err) {
				  if (err) {
						return err;
				  }
				  else {
				  	console.log("Emp update Successful");
				  	res.redirect("/employees/listEmployees");
				  }
			  });
		  }
		});
	
	
};

exports.updateEmp = updateEmp;
exports.createEmp = createEmp;
exports.getEmployee = getEmployee;
exports.getEmployeeList = getEmployeeList;

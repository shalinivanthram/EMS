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
	
	if(isAdmin){
		isAdmin = 'Y';
	} else {
		isAdmin = 'N';
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

var getEmployee = function(username, callback){
	console.log("Username:"+username);
	Employee.findOne({'username' : username}).exec(function (err, employee) {
	  if(err){
		  console.log("err: " + err);
                  //return res.send();
	  } else if( employee === null){
		  console.log("username does not exist");
                  callback(null, null);
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
		  //res.json(emp);
                  console.log("Employee Record 1:"+JSON.stringify(emp));
		  callback(null, emp);
	  }
	});
}

var getEmployeeList = function(searchObj, callback){
    
    var employeesJSON = {};
    var employeesData = [];
    var paramName = searchObj.paramName;
    var paramValue = searchObj.paramValue;
    var options = {};
    if(paramName && paramValue){
        options[paramName] = {'$regex': paramValue,$options:'i'};
    }
    console.log("Username :"+JSON.stringify(searchObj.username));
    var username = searchObj.username;
    var isAdmin = searchObj.isAdmin;
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
                  var actions = '<a class="btn btn-success" onclick="getEmp(\''+emp.username+'\');"><i class="glyphicon glyphicon-zoom-in icon-white"></i>View</a>';
                  if(isAdmin==='Y'){
                      actions = '<a class="btn btn-success" style="margin-right:5px;" onclick="getEmp(\''+emp.username+'\');"><i class="glyphicon glyphicon-zoom-in icon-white"></i>View</a>'+
                                '<a class="btn btn-info" style="margin-right:5px;" href="/employees/editEmp?username='+emp.username+'"><i class="glyphicon glyphicon-edit icon-white"></i>Edit</a>'+
                                '<a class="btn btn-danger" href="/employees/deleteEmp?username='+emp.username+'"><i class="glyphicon glyphicon-trash icon-white"></i>Delete</a>';
                  }
                  if(emp.username===username){
                      actions = '<a class="btn btn-success" style="margin-right:5px;" onclick="getEmp(\''+emp.username+'\');"><i class="glyphicon glyphicon-zoom-in icon-white"></i>View</a>'+
                                '<a class="btn btn-info" href="/employees/editEmp?username='+emp.username+'"><i class="glyphicon glyphicon-edit icon-white"></i>Edit</a>';
                  }
                  
                  console.log("Employee :"+employee);
                  employee.push(actions);
                  employeesData.push(employee);
              });
              employeesJSON["DATA"] = employeesData;
             callback(null, employeesJSON);
             // return employeesJSON;
        }
    });
}
var updateEmp = function(emp, callback){
	console.log('from req: ' + emp.isAdmin);
	var userName= emp.userName;
        var isAdmin = emp.isAdmin;
	if(!isAdmin){
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
			  employee.firstName = emp.firstName;
			  employee.lastName = emp.lastName;
			  employee.email = emp.email;
			  employee.phone = emp.phone;
			  employee.doj = emp.doj;
			  employee.isAdmin = isAdmin;
			  employee.password = emp.password;
				
			  employee.save(function (err) {
				  if (err) {
						return err;
				  }
				  else {
				  	console.log("Emp update Successful");
				  	//res.json({"status":"Success"});
                                        callback(null,{"status":"Success"});
				  }
			  });
		  }
		});
	
	
};

var delEmp = function(userName, callback){
	
	Employee.findOne({'username' : userName}).exec(function (err, employee) {
		  if(err){
			  console.log("err: " + err);
		  } else if( employee === null){
			  console.log("username does not exist");
		  } else {
			  console.log("going to del");
			  employee.remove(function (err) {
				  if (err) {
						callback(err,null);
				  }
				  else {
                                      //res.json({"status":"Success"});
				  	callback(null,{"status":"Success"});
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
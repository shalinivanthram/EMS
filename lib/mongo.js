/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var mongoose = require('mongoose');
var config = require('../config.json');
var Schema = mongoose.Schema;
var mongoUri = "mongodb://"+config.mongodb.host+":27017/"+config.mongodb.db;

var options = {
  db: { native_parser: true },
  server: { poolSize: 5 },
  replset: { rs_name: '' },
  user: '',
  pass: ''
};

mongoose.connect(mongoUri, options);
console.log("Connected to DB :"+JSON.stringify(mongoUri));
var Employee = mongoose.model('employee', new Schema({ firstName: String,
                                                  lastName:String,
                                                  username:String,
                                                  password:String,
                                                  email:String,
                                                  phone:String,
                                                  isAdmin:String,
                                                  doj:String
                                              }));



//Export all the collections in MongoDB
exports.Employee=Employee;
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

var chai = require('chai');

var server = require('../app');

var assert = chai.assert;

var employee = require('./employee');

/*global describe:true,it:true*/
describe('Returns success response with valid data :', function () {
    it('Get Employee with valid input', function () {
        var result = {"firstName": "abcd", "lastName": "defg", "userName": "bmangara@in.ibm.com", "password": "1234", "email": "xyz@gmail.com", "phone": "1234567890", "isAdmin": "Y", "doj": "02/07/2017"};

        employee.getEmployee("bmangara@in.ibm.com", function (err, res) {
            if (!err) {
                assert.equal(result, res);
            }
        });

    });

});

describe('Returns success response with invalid data :', function () {
    it('With invalid username', function () {

        employee.getEmployee("", function (err, res) {
            if (!err) {
                assert.isNull(res, 'Invalid username');
            }
        });

    });

});
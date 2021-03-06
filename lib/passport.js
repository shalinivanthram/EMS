'use strict';

module.exports = function (app) {
    var passport = require('passport'),
        LocalStrategy = require('passport-local').Strategy,
        mongo = require('../lib/mongo');

    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new LocalStrategy(
        function (username, password, done) {

            var Employee = mongo.Employee;

            Employee.findOne({username: username}, function (err, employee) {
                if (err) {
                    return done(err);
                }
                if (!employee) {
                    return done(null, false);
                }
                if (employee.password !== password) {
                    return done(null, false);
                }
                return done(null, employee);
            });
        }
    ));

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });

};

'use strict';

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    console.log("Request Body :" + req);
    res.render('login', {title: 'EMS Login'});
});

router.get("/signUp", function (req, res) {
    console.log("Request Body :" + req);
    res.render("signUp");
});

module.exports = router;

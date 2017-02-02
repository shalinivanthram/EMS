var express = require('express');
var router = express.Router();
var mongo = require('../lib/mongo');

/* GET users listing. */
router.post('/login', function(req, res, next) {
    require('passport').authenticate('local', {failureRedirect: '/?error=error.login_error'})(req, res, next);
}, function(req, res, next) {
    res.render("listEmployees");
});

router.get('/logout', function(req, res, next) {
    req.logout();
    res.redirect('/');
});

module.exports = router;

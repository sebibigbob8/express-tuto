var express = require('express');
var router = express.Router();
const User = require('../models/user');
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});
/**
 Create a new user.
 */
router.post('/', function (req, res, next) {
    new User(req.body).save(function (err, newUser) {
        if (err) {
            return next(err);
        }
        res.status(201).send(newUser);
    });
});

module.exports = router;

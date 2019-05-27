var express = require('express');
var router = express.Router();
const User = require('../models/user');
const ObjectId = require('mongoose').Types.ObjectId;
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
/**
 * Retrieve all users
 */
router.get('/', function (req, res, next) {
    let query = User.find();
    query.exec(function (err, users) {
        if (err) {
            return next(err);
        }
        res.status(200).send(users);
    });
});
/**
 * Update an user
 */
router.patch('/:id', function (req, res, next) {
    // test the MongoId
    const userId = req.params.id;
    if (!ObjectId.isValid(userId)) {
        return next(new Error('wrong ID'));
    }
    //Test the body
    if (req.body.username === undefined) {
        return next(new Error('wrong request body'));
    }
    let query = User.findById(userId);
    query.exec(function (err, user) {
        if (err) {
            return next(err);
        } else if (!user) {
            return next(new Error('user not found'));
        } else {
            user.username = req.body.username;
            user.save(function (err, savedUser) {
                if (err) {
                    return next(err);
                }
                res.send(savedUser).status(200);
            });
        }
    });
});
/**
 * Delete an user
 */
router.delete('/:id', function (req, res, next) {
    // test the MongoId
    const userId = req.params.id;
    if (!ObjectId.isValid(userId)) {
        return next(new Error('wrong ID'));
    }
    let query = User.findById(userId);
    query.exec(function (err, user) {
        if (err) {
            return next(err);
        } else if (!user) {
            return next(new Error('user not found'));
        } else {
            user.delete(function (err, deletedUser) {
                if (err) {
                    return next(err);
                }
                res.send(deletedUser).status(200);
            });
        }
    });
});
module.exports = router;

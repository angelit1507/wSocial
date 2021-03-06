'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
    fs = require('fs'),
    path = require('path'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    mongoose = require('mongoose'),
    multer = require('multer'),
    config = require(path.resolve('./config/config')),
    User = mongoose.model('User');

/**
 * Send User
 */
exports.feeds = function(req, res) {
    var user = req.user;
    User.findOne({ _id: user._id }, {})
        .sort({'feeds.created': -1})
        .populate({
            path: 'feeds',
            model: 'Feed',
            populate: {
                path: 'user',
                model: 'User',
                select: 'displayName'
            }
        })
        
        .exec(function(err, userResult) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else if (!userResult) {
                return res.status(404).send({
                    message: 'No user with that identifier has been found'
                });
            }
            res.json(userResult.feeds);
        });
};

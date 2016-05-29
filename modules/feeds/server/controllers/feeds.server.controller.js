'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
    mongoose = require('mongoose'),
    Feed = mongoose.model('Feed'),
    User = mongoose.model('User'),
    errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
    _ = require('lodash');

/**
 * Create a Feed
 */
exports.create = function(req, res) {
    var feed = new Feed(req.body);
    feed.user = req.user;

    feed.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(feed);
        }
    });
};

/**
 * Show the current Feed
 */
exports.read = function(req, res) {
    // convert mongoose document to JSON
    var feed = req.feed ? req.feed.toJSON() : {};

    // Add a custom field to the Article, for determining if the current User is the "owner".
    // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
    feed.isCurrentUserOwner = req.user && feed.user && feed.user._id.toString() === req.user._id.toString() ? true : false;

    res.jsonp(feed);
};

/**
 * Update a Feed
 */
exports.update = function(req, res) {
    var feed = req.feed;

    feed = _.extend(feed, req.body);

    feed.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(feed);
        }
    });
};

/**
 * Delete an Feed
 */
exports.delete = function(req, res) {
    var feed = req.feed;

    feed.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(feed);
        }
    });
};

/**
 * List of Feeds
 */
exports.list = function(req, res) {
    Feed.find().sort('-created').populate('user', 'displayName').exec(function(err, feeds) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(feeds);
        }
    });
};

/**
 * Feed middleware
 */
exports.feedByID = function(req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Feed is invalid'
        });
    }

    Feed.findById(id,
        { 'activities.type': 1, 'activities.userRefs': 1 }, {})
        .populate({
            path: 'user',
            select: 'displayName',
            model: 'User'
        })
        .populate({
            path: 'activities.userRefs',
            model: 'User',
            select: 'displayName',
        })
        .exec(function(err, feed) {
            if (err) {
                return next(err);
            } else if (!feed) {
                return res.status(404).send({
                    message: 'No Feed with that identifier has been found'
                });
            }
            req.feed = feed;
            next();
        });
};

exports.like = function(req, res) {
    var feed = req.feed;
    var user = req.user;
    Feed.like(feed._id, user._id, function(err, result) {
        console.log('liked feed');
        res.status(200).send();
    });
};

exports.comment = function(req, res) {
    var feed = req.feed;
    var user = req.user;
    console.log(req.body);
    Feed.comment(feed._id, user._id, req.body, function(err, result) {
        console.log('commented feed');
        res.status(200).send();
    });
};
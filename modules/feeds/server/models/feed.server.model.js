'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Feed Schema
 */
var FeedSchema = new Schema({
    name: {
        type: String,
        default: '',
        required: 'Please fill Feed name',
        trim: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    activities: {
        type: [{
            type: {
                type: String,
                enum: ['Comment', 'Like'],
                default: 'Comment'
            },
            created: {
                type: Date,
                default: Date.now
            },
            userRefs: [
                {
                    type: Schema.ObjectId,
                    ref: 'User'
                }
            ],
            objectRefs: [{
                type:
                {
                    type: String,
                    enum: ['Text']
                },
                content:
                {
                    type: String,
                    default: ''
                }
            }
            ]
        }
        ],
        default: []
    },
    geoLocation: {
        type: [Number],  // [<longitude>, <latitude>]
        index: '2d'      // create the geospatial index
    }
});

FeedSchema.post('save', function(doc) {
    console.log('%s feed has been saved', doc._id);
    var User = mongoose.model('User');
    User.findByLocation({ location: doc.geoLocation }, function(err, result) {
        if (err)
            return;
        result.forEach(function(user) {
            User.findByIdAndUpdate(
                user._id,
                { $push: { "feeds": doc } },
                { safe: true, upsert: true, new: true },
                function(err, model) {
                    console.log(err);
                }
            );
        }, this);
    });
    // User.findById(doc.user._id, function(err, user) {
    //     user.feeds.push(doc);
    //     user.save(function() {
    //     });
    // })
});


FeedSchema.statics.like = function(feedId, userId, callback) {
    var activity = {
        type: 'Like',
        userRefs: [
            userId
        ]
    };
    this.findByIdAndUpdate(
        feedId,
        { $push: { "activities": activity } },
        { safe: true, upsert: true, new: true },
        function(err, model) {
            callback(err, model);
        }
    );
};

FeedSchema.statics.comment = function(feedId, userId, data, callback) {
    var activity = {
        type: 'Comment',
        userRefs: [
            userId
        ],
        objectRefs: [
            {
                type: 'Text',
                content: data.content
            }
        ]
    };
    this.findByIdAndUpdate(
        feedId,
        { $push: { "activities": activity } },
        { safe: true, upsert: true, new: true },
        function(err, model) {
            callback(err, model);
        }
    );
};

mongoose.model('Feed', FeedSchema);

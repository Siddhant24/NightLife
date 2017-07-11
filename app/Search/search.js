'use strict';

var request = require('request');
var User = require('../models/users');

module.exports = {
    nearby: function(data){
        return new Promise(function(resolve, reject){
        var url = `${process.env.API_URL}?location=${data.latitude},${data.longitude}&radius=50000&type=bar&key=${process.env.API_KEY}`;
        request(url, function (err, response, body) {
            if(err) console.log(err);
            if(response.statusCode !== 200) console.log(response);
            resolve(body);
            }
        );
        });
    },
    
    addBar: function(user_id, bar_id){
        return new Promise(function(resolve, reject){
            User.findOneAndUpdate({
                _id: user_id
            }, {
                $addToSet: {bars: bar_id}
            }, {new: true}, function(err, doc){
                if(err) console.error(err);
            });
            resolve("success");
        });
    },
    
    allBars: function(){
        return new Promise(function(resolve, reject){
            resolve(User.find({},{bars: 1, _id: 0}));
        });
    },
    
    myBars: function(user_id){
        return new Promise(function(resolve, reject){
            resolve(User.find({_id: user_id}, {bars: 1, _id: 0}));
        });
    },
    
    deleteBar: function(user_id, bar_id){
        return new Promise(function(resolve, reject){
            User.findOneAndUpdate({_id: user_id}, {
                $pull: {bars: bar_id}
            }, {new: true}, function(err, doc){
                if(err) console.error(err);
            });
             resolve("success");
        })
    }
};
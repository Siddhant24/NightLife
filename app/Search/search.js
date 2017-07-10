'use strict';

var request = require('request');

module.exports = {
    nearby: function(data){
        return new Promise(function(resolve, reject){
        var url = `${process.env.API_URL}?location=${data.latitude},${data.longitude}&radius=50000&type=bar&key=${process.env.API_KEY}`;
       // console.log(url);
        request(url, function (err, response, body) {
            if(err) console.log(err);
            if(response.statusCode !== 200) console.log(response);
            resolve(body);
            }
        );
    });
    }
};
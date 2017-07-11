'use strict';

var path = process.cwd();
var search = require('../Search/search.js');

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	app.route('/')
		.get(function (req, res) {
			res.sendFile(path + '/public/index.html');
		});

	app.route('/login')
		.get(function (req, res) {
			res.sendFile(path + '/public/login.html');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/login');
		});

	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.sendFile(path + '/public/profile.html');
		});

	app.route('/api/:id')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.github);
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));
		
	app.route('/search')
		.post(function(req, res){
			search.nearby(req.body).then(function(data){
				res.send(data);
			});
		})
		.get(function(req, res){
			search.myBars(req.user._id).then(function(data){
				res.send(data);
			})
		});
		
	app.route('/authenticated')
		.get(function(req, res){
			res.send(req.isAuthenticated());
		});
		
	app.route('/going')
		.post(function(req, res){
			search.addBar(req.user._id, req.body.bar_id).then(function(data){
				res.send("success");
			});
		})
		.get(function(req, res){
			search.allBars().then(function(data){
				res.send(data);
			});
		});
		
	app.route('/delete')
		.post(function(req, res){
			search.deleteBar(req.user._id, req.body.bar_id).then(function(data){
				res.send(data);
			})
		});

};

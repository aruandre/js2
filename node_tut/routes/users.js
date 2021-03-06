const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const expressValidator = require('express-validator');
router.use(expressValidator());

//bring in user model
let User = require('../models/user');

//register form
router.get('/register', (req, res) => {
	res.render('register');
});

//register process
router.post('/register', (req, res) => {
	const name = req.body.name;
	const email = req.body.email;
	const username = req.body.username;
	const password = req.body.password;
	const password2 = req.body.password2;

	req.check('name', 'Name is required').notEmpty();
	req.check('email', 'Email is required').notEmpty();
	req.check('email', 'Email is not valid').isEmail();
	req.check('username', 'Username is required').notEmpty();
	req.check('password', 'Password is required').notEmpty();
	req.check('password2', 'Passwords do not match').equals(req.body.password);

	let errors = req.validationErrors();

	if(errors){
		res.render('register', {
			errors: errors
		});
	} else {
		let newUser = new User({
			name: name,
			email: email,
			username: username,
			password: password
		});

		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(newUser.password, salt, (err, hash) => {
				if(err){
					console.log(err);
				}
				newUser.password = hash;
				newUser.save((err) => {
					if(err){
						console.log(err);
						return;
					} else {
						req.flash('success', 'You are now register and can log in');
						res.redirect('/users/login');
					}
				});
			});
		});
	}
});

//login form
router.get('/login', (req, res) => {
	res.render('login');
	req.flash('succes', 'You are now logged in');
});

//login process
router.post('/login', (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/users/login',
		failureFlash: true
	})(req, res, next);
});

//logout
router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success', 'You are logged out');
	res.redirect('/users/login');
});

//profile
router.get('/profile', (req, res) => {
	res.render('profile');
});

module.exports = router;
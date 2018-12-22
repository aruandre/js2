const express = require('express');
const router = express.Router();


//bring in article model
let Article = require('../models/article');
let User = require('../models/user');


//add article route
router.get('/add', ensureAuthenticated, (req, res) => {
	res.render('add_article', {
		title: 'Add article'
	});
});

//add submit POST route
router.post('/add', (req, res) => {
	let article = new Article();
	article.title = req.body.title;
	article.author = req.user._id;
	article.content = req.body.content;
	article.isPublic = req.body.isPublic == undefined ? false : true;

	article.save((err) => {
		if(err){
			console.log(err);
		} else {
			req.flash('success', 'Article added');
			res.redirect('/');
		}
	});
});

//load edit form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
	Article.findById(req.params.id, (err, article) => {
		if(article.author != req.user._id){
			req.flash('danger', 'Not authorized');
			return res.redirect('/');
		}
		res.render('edit_article', {
			title: 'Edit article',
			article: article
		});
	});
});

//edit submit POST route
router.post('/edit/:id', (req, res) => {
	let article = {};
	article.title = req.body.title;
	article.author = req.body.author;
	article.content = req.body.content;
	article.isPublic = req.body.isPublic == undefined ? false : true;

	let query = {_id:req.params.id}

	Article.update(query, article, (err) => {
		if(err){
			console.log(err);
		} else {
			req.flash('success', 'Article updated');
			res.redirect('/');
		}
	});
});

//delete article
router.delete('/:id', (req, res) => {
	if(!req.user._id){
		res.status(500).send();
	}

	let query = {_id:req.params.id}

	Article.findById(req.params.id, (err, article) => {
		if(article.author != req.user._id){
			res.status(500).send();
		} else {
			Article.deleteOne(query, (err) => {
				if(err){
					console.log(err);
				}
				res.send('Success');
			});
		}
	});

});

//get single article
router.get('/:id', (req, res) => {
	Article.findById(req.params.id, (err, article) => {
		User.findById(article.author, (err, user) => {
			res.render('article', {
				article: article,
				author: user.name
			});
		});
	});
});

//access control
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash('danger', 'Please log in');
		res.redirect('/users/login');
	}
}

module.exports = router;
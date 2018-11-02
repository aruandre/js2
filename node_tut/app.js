const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const slugify = require('slugify');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');


mongoose.connect('mongodb://localhost/harjutus01');
let db = mongoose.connection;

//check connection
db.once('open', () => {
	console.log("--- connected to mongoDB ---");
});

//check for DB errors
db.on('error', (err) => {
	console.log(err);
});

//init app
const app = express();

//bring in models
let Article = require('./models/article');

//load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//bodyparser MW
//parse application
app.use(bodyParser.urlencoded({ extended: false }))
//parse application/json
app.use(bodyParser.json())

//set public folder
app.use(express.static(path.join(__dirname, 'public')));

//express session MW
app.use(session({
	secret: 'keyboard cat',
	resave: true,
	saveUninitialized: true
}));

//express messages MW
app.use(require('connect-flash')());
app.use((req, res, next) => {
	res.locals.messages = require('express-messages')(req, res);
	next();
});

//express validator MW
app.use(expressValidator({
	errorFormatter: (param, msg, value) => {
		var namespace = param.split('.'),
		root = namespace.shift(),
		formParam = root;

		while(namespace.length){
			formParam += '[' + namespace.shift() + ']';
		}
		return {
			param: formParam,
			msg: msg,
			value: value
		};
	}
}));

//home route
app.get('/', (req, res) => {
	Article.find({}, (err, articles) => {
		if(err){
			console.log(err);
		} else {
			res.render('index', {
			title: 'Artiklid',
			articles: articles
			});
		}
	});	
});

//get single article
app.get('/article/:id', (req, res) => {
	Article.findById(req.params.id, (err, article) => {
		res.render('article', {
			article: article
		});
	});
});

//add article route
app.get('/articles/add', (req, res) => {
	res.render('add_article', {
		title: 'Add article'
	});
});

//add submit POST route
app.post('/articles/add', (req, res) => {
	let article = new Article();
	article.title = req.body.title;
	article.author = req.body.author;
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
app.get('/article/edit/:id', (req, res) => {
	Article.findById(req.params.id, (err, article) => {
		res.render('edit_article', {
			title: 'Edit article',
			article: article
		});
	});
});

//edit submit POST route
app.post('/articles/edit/:id', (req, res) => {
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
app.delete('/article/:id', (req, res) => {
	let query = {_id:req.params.id}

	Article.deleteOne(query, (err) => {
		if(err){
			console.log(err);
		}
		res.send('Success');
	});
});


//start server
app.listen(3000, () => {
	console.log("--- server kuulab porti 3000 ---");
});
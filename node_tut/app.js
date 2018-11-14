const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const slugify = require('slugify');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const config = require('./config/database');

mongoose.connect(config.database);
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


//--------------
//socket.io
const http = require('http').Server(app);
const io = require('socket.io')(http);

//kuula uusi ühendusi
io.on('connection', (socket) => {
	console.log('--- uus kasutaja liitus ---');

    // võtame kliendi poolt vastu teate "chat"
    socket.on('chat', (msg) => {
        // saadame kõikidele klientidele tagasi
        io.emit('chat', msg);
    });
});


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

//----------------------
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

//route files
let articles = require('./routes/articles');
let users = require('./routes/users');
let crypto = require('./routes/crypto');
let chat = require('./routes/chat');
app.use('/articles', articles);
app.use('/users', users);
app.use('/crypto', crypto);
app.use('/chat', chat);


//------------------------------
//start server
http.listen(3000, () => {
	console.log("--- server kuulab porti 3000 ---");
});

//----------------------------------------
//jäi pooleli siin -> https://www.youtube.com/watch?v=mAOxWf36YLo&index=10&list=PLillGF-RfqbYRpji8t4SxUkMxfowG4Kqp&pbjreload=10
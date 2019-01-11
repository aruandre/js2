const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const slugify = require('slugify');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
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

//connected users
connections = [];

//listen to new connections
io.on('connection', (socket) => {
	let chat = db.collection('chats');
	connections.push(socket);
	console.log('--- %s users connected ---', connections.length);

	//disconnect
	socket.on('disconnect', (data) => {
		connections.splice(connections.indexOf(socket), 1);
		console.log('--- user %s disconnected ---', connections.length);
		//socket.name = name;
	});

	/*socket.on('user_connected', (data) => {
		socket.broadcast.emit({name: name} + 'joined chat');
	});
	*/
/*
	socket.on('nimi', (name) => {
		socket.name = name;
	});
*/

	sendStatus = ((s) => {
		socket.emit('status', s);
	});

/*
	//get chats from DB
	chat.find().limit(100).sort({_id:1}).toArray((err, res) => {
		if(err){
			throw err;
		} else {
		    // saadame kõikidele klientidele tagasi
		    socket.emit('output', res);
		}
	});
*/
	//handle input events
	socket.on('input', (data) => {
		let name = data.name;
		let message = data.message;

		//check for name and message
		if(name == '' || message == ''){
			//send error status
			sendStatus('please enter a name and message');
		} else {
			//insert msg
			chat.insertOne({name: name, message: message}, () => {
				io.emit('output', [data]);
				
				//send status obj
				sendStatus({
					message: 'Message sent',
					clear: true
				});
			});
		}
	});

	//handle clear
	socket.on('clear', (data) => {
		//remove all chats from collection
		chat.remove({}, () => {
			//emit cleared
			socket.emit('cleared');
		});
	});

	//handle edit
	socket.on('edit', (data) => {
		chat.findOneAndUpdate({name: name, message: message}, () => {
			io.emit('output', [data]);
			sendStatus({
					message: 'Message sent',
					clear: true
				});
		});
	});

	//handle getMsg
	socket.on('getMsg', (data) => {
		chat.find();
	});

	//handle typing
	socket.on('typing', (data) => {
		socket.broadcast.emit('typing', {name: name});
		//socket.emit('typing');
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
/*app.use(expressValidator({
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
*/

//---------------------
//passport config
require('./config/passport')(passport);
//passport MW
app.use(passport.initialize());
app.use(passport.session());

app.get('*', (req, res, next) => {
	res.locals.user = req.user || null;
	next();
});

//----------------------
//home route
app.get('/', (req, res) => {
	Article.find({}, (err, articles) => {
		if(err){
			console.log(err);
		} else {
			res.render('index', {
			title: 'Articles',
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
//let vision = require('./routes/vision');
app.use('/articles', articles);
app.use('/users', users);
app.use('/crypto', crypto);
app.use('/chat', chat);
//app.use('/vision', vision);


//------------------------------
//start server
http.listen(3000, () => {
	console.log("--- server kuulab porti 3000 ---");
});
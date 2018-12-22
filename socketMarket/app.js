const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
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
/*
	sendStatus = ((s) => {
		socket.emit('status', s);
	});
*/

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
			chat.insert({name: name, message: message}, () => {
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

	//handle typing
	socket.on('typing', (data) => {
		socket.broadcast.emit('typing', {name: name});
		//socket.emit('typing');
	});
});


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


//----------------------
//home route
app.get('/', (req, res) => {
	res.render('index');
});


//------------------------------
//start server
http.listen(3000, () => {
	console.log("--- server kuulab porti 3000 ---");
});
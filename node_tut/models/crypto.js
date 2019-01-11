let mongoose = require('mongoose');

//article schema
let cryptoSchema = mongoose.Schema({
	name:{
		type: String,
		trim: true,
		required: true
	},
	price_eur:{
		type: String,
		trim: true,
		required: true
	},
	date:{
		type: Date,
		default: Date.now
	}
	/*dateModified:{
		type: Date,
		default: Date.now
	}*/
});

let Crypto = module.exports = mongoose.model('Crypto', cryptoSchema);
let mongoose = require('mongoose');

//product schema
let articleSchema = mongoose.Schema({
	title:{
		type: String,
		trim: true,
		required: true
	},
	author:{
		type: String,
		trim: true,
		required: true
	},
	content:{
		type: String,
		trim: true,
		required: true
	},
	isPublic:{
		type: Boolean,
		default: false,
		required: true
	},
	dateCreated:{
		type: Date,
		default: Date.now
	}
	/*dateModified:{
		type: Date,
		default: Date.now
	}*/
});

let Article = module.exports = mongoose.model('Article', articleSchema);
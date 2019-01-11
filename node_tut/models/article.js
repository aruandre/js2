let mongoose = require('mongoose');

//product schema
let productSchema = mongoose.Schema({
	title:{
		type: String,
		trim: true,
		required: true
	},
	price:{
		type: Number,
		trim: true,
		required: true
	},
	dateCreated:{
		type: Date,
		default: Date.now
	}
});

let Product = module.exports = mongoose.model('Product', productSchema);
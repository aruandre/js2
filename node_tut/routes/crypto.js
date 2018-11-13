const express = require('express');
const router = express.Router();
const CoinMarketCap = require('coinmarketcap-api');

const apiKey = '78154020-a5ac-4078-8459-17be2e3184de';
const client = new CoinMarketCap(apiKey);


client.getTickers().then(console.log).catch(console.error);
client.getGlobal().then(console.log).catch(console.error);

//bring in article model
//let Crypto = require('../models/crypto_query');

//view leht
router.get('/crypto', (req, res) => {
	res.render('crypto');
});

//crypto route
router.get('/crypto', (req, res) => {
	Crypto.find({}, (err, crypto) => {
		if(err){
			console.log(err);
		} else {
			res.render('crypto', {
			title: 'Crypto',
			crypto: crypto
			});
		}
	});	
});


module.exports = router;
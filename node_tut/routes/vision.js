const express = require('express');
const router = express.Router();
const vision = require('@google-cloud/vision');
// Creates a client
const client = new vision.ImageAnnotatorClient();

//vision home
router.get('/', (req, res) => {
	res.render('vision');
});



module.exports = router;
const express = require('express');
const router = express.Router();

//crypto home
router.get('/', (req, res) => {
	res.render('crypto');
});

module.exports = router;
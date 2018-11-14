const express = require('express');
const router = express.Router();

//chat home
router.get('/', (req, res) => {
	res.render('chat');
});

module.exports = router;
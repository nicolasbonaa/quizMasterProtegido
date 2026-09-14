const express = require('express');
const router = express.Router();
const searchController = require('./searchController');

// busca global
router.get('/search', searchController.search);

module.exports = router;
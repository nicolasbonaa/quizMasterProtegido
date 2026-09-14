var express = require('express');
var router = express.Router();
const { success } = require('../middlewares/apiResponse');
const { issueCsrfToken } = require('../middlewares/csrf');
router.get('/', (req, res) => {
    return success(res, {
        name: 'QuizMaster API',
        version: '1.0.0',
        status: 'online'
    }, 'Bem-vindo à API do QuizMaster.');
});
router.get('/csrf-token', issueCsrfToken);
module.exports = router;
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.route('/register').post(authController.userRegister);
router.route('/login').post(authController.userLogin);

module.exports = router;

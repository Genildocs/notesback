const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.route('/users/register').post(authController.userRegister);
router.route('/users/login').post(authController.userLogin);

module.exports = router;

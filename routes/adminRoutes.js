const express = require('express');
const router = express.Router();
const path = require('path');
const authMiddleware = require('../middleware/authMiddleware');

// Middleware para verificar autenticação e permissões de admin
router.use(authMiddleware.isAuth);
router.use(authMiddleware.restrictTo('admin'));

// Rota para a página administrativa
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin.html'));
});

module.exports = router;
 
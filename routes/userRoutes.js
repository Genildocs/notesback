const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

// Middleware para todas as rotas
router.use(authController.isAuth);

// Rota base para operações em lote (apenas admin)
router.route('/')
  .get(authController.isAdmin, userController.getAllUsers);    // GET /api/v1/users - Lista todos os usuários (admin)

// Rota para usuário logado
router.get('/me', userController.getLoggedUser);  // GET /api/v1/users/me - Obtém dados do usuário logado

// Rotas para operações em um usuário específico
router.route('/:id')
  .get(userController.getUserById)     // GET /api/v1/users/:id - Busca um usuário específico
  .put(userController.updateUser)      // PUT /api/v1/users/:id - Atualiza um usuário
  .delete(userController.deleteUser);  // DELETE /api/v1/users/:id - Remove um usuário

// Middleware para rotas não encontradas
router.use((req, res) => {
  res.status(404).json({ 
    error: 'Rota não encontrada',
    message: 'A rota solicitada não existe na API de usuários',
    valid: false
  });
});

module.exports = router;

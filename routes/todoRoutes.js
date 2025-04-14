const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const authController = require('../controllers/authController');

// Middleware para todas as rotas
router.use(authController.isAuth);

// Rota base para operações em lote
router.route('/')
  .get(todoController.getAllTodos)    // GET /api/v1/todos - Lista todos os todos do usuário
  .post(todoController.createTodo);   // POST /api/v1/todos - Cria um novo todo

// Rotas para operações em um todo específico
router.route('/:id')
  .get(todoController.getTodoById)    // GET /api/v1/todos/:id - Busca um todo específico
  .put(todoController.updateTodo)     // PUT /api/v1/todos/:id - Atualiza um todo
  .delete(todoController.deleteTodo); // DELETE /api/v1/todos/:id - Remove um todo

// Middleware para rotas não encontradas
router.use((req, res) => {
  res.status(404).json({ 
    error: 'Rota não encontrada',
    message: 'A rota solicitada não existe na API de todos',
    valid: false
  });
});

module.exports = router; 
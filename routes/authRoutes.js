const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @api {post} /api/auth/register Registrar novo usuário
 * @apiName RegisterUser
 * @apiGroup Auth
 * @apiVersion 1.0.0
 * 
 * @apiParam {String} username Nome de usuário (3-30 caracteres, apenas letras, números e underscore)
 * @apiParam {String} email Email do usuário
 * @apiParam {String} password Senha (mínimo 8 caracteres)
 * 
 * @apiSuccess {String} token Token JWT para autenticação
 * @apiSuccess {Object} user Dados do usuário criado
 * @apiSuccess {String} user.id ID do usuário
 * @apiSuccess {String} user.username Nome de usuário
 * @apiSuccess {String} user.email Email do usuário
 * @apiSuccess {String} user.role Role do usuário (user/admin)
 * 
 * @apiError {Object} error Objeto de erro
 * @apiError {String} error.message Mensagem de erro
 */
router.post('/register', authController.userRegister);

/**
 * @api {post} /api/auth/login Login de usuário
 * @apiName LoginUser
 * @apiGroup Auth
 * @apiVersion 1.0.0
 * 
 * @apiParam {String} email Email do usuário
 * @apiParam {String} password Senha do usuário
 * 
 * @apiSuccess {String} token Token JWT para autenticação
 * @apiSuccess {Object} user Dados do usuário
 * @apiSuccess {String} user.id ID do usuário
 * @apiSuccess {String} user.username Nome de usuário
 * @apiSuccess {String} user.email Email do usuário
 * @apiSuccess {String} user.role Role do usuário (user/admin)
 * 
 * @apiError {Object} error Objeto de erro
 * @apiError {String} error.message Mensagem de erro
 */
router.post('/login', authController.userLogin);

// Middleware para rotas não encontradas
router.use((req, res) => {
  res.status(404).json({ 
    error: 'Rota não encontrada',
    message: 'A rota solicitada não existe na API de autenticação',
    valid: false
  });
});

module.exports = router;

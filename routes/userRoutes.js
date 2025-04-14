const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Todas as rotas abaixo requerem autenticação
router.use(authMiddleware.isAuth);

/**
 * @api {get} /api/users/me Obter dados do usuário logado
 * @apiName GetMe
 * @apiGroup User
 * @apiVersion 1.0.0
 * 
 * @apiHeader {String} Authorization Token JWT
 * 
 * @apiSuccess {Object} user Dados do usuário
 * @apiSuccess {String} user.id ID do usuário
 * @apiSuccess {String} user.username Nome de usuário
 * @apiSuccess {String} user.email Email do usuário
 * @apiSuccess {String} user.role Role do usuário
 * 
 * @apiError {Object} error Objeto de erro
 * @apiError {String} error.message Mensagem de erro
 */
router.get('/me', userController.getMe);

/**
 * @api {patch} /api/users/updateMe Atualizar dados do usuário logado
 * @apiName UpdateMe
 * @apiGroup User
 * @apiVersion 1.0.0
 * 
 * @apiHeader {String} Authorization Token JWT
 * 
 * @apiParam {String} [username] Novo nome de usuário
 * @apiParam {String} [email] Novo email
 * 
 * @apiSuccess {Object} user Dados atualizados do usuário
 * 
 * @apiError {Object} error Objeto de erro
 * @apiError {String} error.message Mensagem de erro
 */
router.patch('/updateMe', userController.updateMe);

/**
 * @api {delete} /api/users/deleteMe Deletar conta do usuário logado
 * @apiName DeleteMe
 * @apiGroup User
 * @apiVersion 1.0.0
 * 
 * @apiHeader {String} Authorization Token JWT
 * 
 * @apiSuccess {String} status Status da operação
 * 
 * @apiError {Object} error Objeto de erro
 * @apiError {String} error.message Mensagem de erro
 */
router.delete('/deleteMe', userController.deleteMe);

// Rotas apenas para administradores
router.use(authMiddleware.restrictTo('admin'));

/**
 * @api {get} /api/users Listar todos os usuários
 * @apiName GetAllUsers
 * @apiGroup Admin
 * @apiVersion 1.0.0
 * 
 * @apiHeader {String} Authorization Token JWT
 * 
 * @apiSuccess {Array} users Lista de usuários
 * @apiSuccess {Number} results Número total de usuários
 * 
 * @apiError {Object} error Objeto de erro
 * @apiError {String} error.message Mensagem de erro
 */
router.get('/', userController.getAllUsers);

/**
 * @api {get} /api/users/:id Obter usuário específico
 * @apiName GetUser
 * @apiGroup Admin
 * @apiVersion 1.0.0
 * 
 * @apiHeader {String} Authorization Token JWT
 * 
 * @apiParam {String} id ID do usuário
 * 
 * @apiSuccess {Object} user Dados do usuário
 * 
 * @apiError {Object} error Objeto de erro
 * @apiError {String} error.message Mensagem de erro
 */
router.get('/:id', userController.getUser);

/**
 * @api {patch} /api/users/:id Atualizar usuário específico
 * @apiName UpdateUser
 * @apiGroup Admin
 * @apiVersion 1.0.0
 * 
 * @apiHeader {String} Authorization Token JWT
 * 
 * @apiParam {String} id ID do usuário
 * @apiParam {String} [username] Novo nome de usuário
 * @apiParam {String} [email] Novo email
 * @apiParam {String} [role] Nova role (user/admin)
 * 
 * @apiSuccess {Object} user Dados atualizados do usuário
 * 
 * @apiError {Object} error Objeto de erro
 * @apiError {String} error.message Mensagem de erro
 */
router.patch('/:id', userController.updateUser);

/**
 * @api {delete} /api/users/:id Deletar usuário específico
 * @apiName DeleteUser
 * @apiGroup Admin
 * @apiVersion 1.0.0
 * 
 * @apiHeader {String} Authorization Token JWT
 * 
 * @apiParam {String} id ID do usuário
 * 
 * @apiSuccess {String} status Status da operação
 * 
 * @apiError {Object} error Objeto de erro
 * @apiError {String} error.message Mensagem de erro
 */
router.delete('/:id', userController.deleteUser);

// Middleware para rotas não encontradas
router.use((req, res) => {
  res.status(404).json({ 
    error: 'Rota não encontrada',
    message: 'A rota solicitada não existe na API de usuários',
    valid: false
  });
});

module.exports = router;

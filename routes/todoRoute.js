/**
 * Documentação das Rotas da API de Todos
 * 
 * Todas as rotas são protegidas por autenticação JWT
 * 
 * @module todoRoutes
 */

const routes = {
  /**
   * @route GET /api/todos
   * @description Lista todos os todos do usuário autenticado
   */
  getAll: 'GET /api/todos',

  /**
   * @route POST /api/todos
   * @description Cria um novo todo para o usuário autenticado
   */
  create: 'POST /api/todos',

  /**
   * @route GET /api/todos/:id
   * @description Busca um todo específico pelo ID
   */
  getById: 'GET /api/todos/:id',

  /**
   * @route PUT /api/todos/:id
   * @description Atualiza um todo existente
   */
  update: 'PUT /api/todos/:id',

  /**
   * @route DELETE /api/todos/:id
   * @description Remove um todo existente
   */
  delete: 'DELETE /api/todos/:id'
};

module.exports = routes;

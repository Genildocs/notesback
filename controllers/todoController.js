const Todo = require("../models/todoModel");
const AppError = require("../utils/AppError");

const getAllTodos = async (request, response) => {
  try {
    // Busca apenas os todos do usuário autenticado
    const todos = await Todo.find({ user: request.user.id })
      .populate('user', { username: 1, name: 1 });
    response.json(todos);
  } catch (error) {
    throw new AppError('Erro ao buscar tarefas', 500);
  }
};

const createTodo = async (request, response) => {
  try {
    const { title, priority, description, important, dueDate, tags } = request.body;

    if (!title || !description) {
      throw new AppError('Título e descrição são obrigatórios', 400);
    }

    const todo = new Todo({
      title,
      priority,
      description,
      important,
      dueDate,
      tags,
      user: request.user.id // Associa o todo ao usuário autenticado
    });

    const savedTodo = await todo.save();
    response.status(201).json(savedTodo);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Erro ao criar tarefa', 500);
  }
};

const getTodoById = async (request, response) => {
  try {
    const todo = await Todo.findOne({ 
      _id: request.params.id,
      user: request.user.id // Verifica se o todo pertence ao usuário
    });

    if (!todo) {
      throw new AppError('Tarefa não encontrada', 404);
    }

    response.json(todo);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Erro ao buscar tarefa', 500);
  }
};

const deleteTodo = async (request, response) => {
  try {
    const todo = await Todo.findOneAndDelete({ 
      _id: request.params.id,
      user: request.user.id // Verifica se o todo pertence ao usuário
    });

    if (!todo) {
      throw new AppError('Tarefa não encontrada', 404);
    }

    response.status(204).end();
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Erro ao deletar tarefa', 500);
  }
};

const updateTodo = async (request, response) => {
  try {
    const { title, priority, description, important, done, dueDate, tags } = request.body;

    const todo = await Todo.findOneAndUpdate(
      { 
        _id: request.params.id,
        user: request.user.id // Verifica se o todo pertence ao usuário
      },
      { title, priority, description, important, done, dueDate, tags },
      { new: true, runValidators: true }
    );

    if (!todo) {
      throw new AppError('Tarefa não encontrada', 404);
    }

    response.json(todo);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Erro ao atualizar tarefa', 500);
  }
};

module.exports = {
  getAllTodos,
  createTodo,
  getTodoById,
  deleteTodo,
  updateTodo
};

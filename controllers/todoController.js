const Todo = require("../models/todoModel");

const getAllTodos = async (request, response) => {
  try {
    const todos = await Todo.find({}).populate('user', { username: 1, name: 1 });
    response.json(todos);
  } catch (error) {
    response.status(500).json({ error: 'Erro ao buscar notas' });
  }
};

const createTodo = async (request, response) => {
  try {
    const { content, important = false } = request.body;

    if (!content) {
      return response.status(400).json({ error: 'Conteúdo da nota é obrigatório' });
    }

    const todo = new Todo({
      content,
      important,
      user: request.user.id,
    });

    const savedTodo = await todo.save();
    request.user.notes = request.user.notes.concat(savedTodo._id);
    await request.user.save();

    response.status(201).json(savedTodo);
  } catch (error) {
    response.status(500).json({ error: 'Erro ao criar nota' });
  }
};

const getTodoById = async (request, response) => {
  try {
    const todo = await Todo.findById(request.params.id);
    if (!todo) {
      return response.status(404).json({ error: 'Nota não encontrada' });
    }
    response.json(todo);
  } catch (error) {
    response.status(500).json({ error: 'Erro ao buscar nota' });
  }
};

const deleteTodo = async (request, response) => {
  try {
    const todo = await Todo.findById(request.params.id);
    
    if (!todo) {
      return response.status(404).json({ error: 'Nota não encontrada' });
    }

    if (todo.user.toString() !== request.user.id) {
      return response.status(403).json({ error: 'Não autorizado a deletar esta nota' });
    }

    await Todo.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch (error) {
    response.status(500).json({ error: 'Erro ao deletar nota' });
  }
};

const updateTodo = async (request, response) => {
  try {
    const { content, important } = request.body;
    const todo = await Todo.findById(request.params.id);

    if (!todo) {
      return response.status(404).json({ error: 'Nota não encontrada' });
    }

    if (todo.user.toString() !== request.user.id) {
      return response.status(403).json({ error: 'Não autorizado a atualizar esta nota' });
    }

    const updatedTodo = await Todo.findByIdAndUpdate(
      request.params.id,
      { content, important },
      { new: true, runValidators: true }
    );

    response.json(updatedTodo);
  } catch (error) {
    response.status(500).json({ error: 'Erro ao atualizar nota' });
  }
};

module.exports = {
  getAllTodos,
  createTodo,
  getTodoById,
  deleteTodo,
  updateTodo
};

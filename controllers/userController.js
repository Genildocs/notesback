const User = require('../models/userModel');

// Obter todos os usuários
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({
      users,
      valid: true
    });
  } catch (error) {
    res.status(500).json({
      message: 'Erro ao buscar usuários',
      error: error.message
    });
  }
};

// Obter usuário logado
exports.getLoggedUser = async (request, response) => {
  try {
    const user = await User.findById(request.user.id);
    if (!user) {
      return response.status(404).json({ 
        message: 'Usuário não encontrado',
        valid: false 
      });
    }

    response.status(200).json({
      user,
      valid: true
    });
  } catch (error) {
    response.status(500).json({
      message: 'Erro ao buscar usuário',
      error: error.message,
      valid: false
    });
  }
};

// Obter usuário por ID
exports.getUserById = async (request, response) => {
  try {
    const user = await User.findById(request.params.id).select('-password');
    if (!user) {
      return response.status(404).json({ 
        message: 'Usuário não encontrado',
        valid: false 
      });
    }

    response.status(200).json({
      user,
      valid: true
    });
  } catch (error) {
    response.status(500).json({
      message: 'Erro ao buscar usuário',
      error: error.message,
      valid: false
    });
  }
};

// Atualizar usuário
exports.updateUser = async (request, response) => {
  try {
    const { username, email } = request.body;
    const user = await User.findById(request.params.id);

    if (!user) {
      return response.status(404).json({ 
        message: 'Usuário não encontrado',
        valid: false 
      });
    }

    // Verifica se o usuário está tentando atualizar seu próprio perfil
    if (user._id.toString() !== request.user.id) {
      return response.status(403).json({ 
        message: 'Não autorizado a atualizar este usuário',
        valid: false 
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      request.params.id,
      { username, email },
      { new: true, runValidators: true }
    ).select('-password');

    response.status(200).json({
      user: updatedUser,
      message: 'Usuário atualizado com sucesso',
      valid: true
    });
  } catch (error) {
    response.status(500).json({
      message: 'Erro ao atualizar usuário',
      error: error.message,
      valid: false
    });
  }
};

// Deletar usuário
exports.deleteUser = async (request, response) => {
  try {
    const user = await User.findById(request.params.id);

    if (!user) {
      return response.status(404).json({ 
        message: 'Usuário não encontrado',
        valid: false 
      });
    }

    // Verifica se o usuário está tentando deletar seu próprio perfil
    if (user._id.toString() !== request.user.id) {
      return response.status(403).json({ 
        message: 'Não autorizado a deletar este usuário',
        valid: false 
      });
    }

    await User.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch (error) {
    response.status(500).json({
      message: 'Erro ao deletar usuário',
      error: error.message,
      valid: false
    });
  }
};

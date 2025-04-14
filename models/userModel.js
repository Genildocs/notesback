const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Nome de usuário é obrigatório'],
    unique: true,
    trim: true,
    minlength: [3, 'Nome de usuário deve ter no mínimo 3 caracteres'],
    maxlength: [30, 'Nome de usuário deve ter no máximo 30 caracteres'],
    match: [/^[a-zA-Z0-9_]+$/, 'Nome de usuário deve conter apenas letras, números e underscore']
  },
  email: { 
    type: String, 
    required: [true, 'Email é obrigatório'], 
    unique: true, 
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
  },
  name: { 
    type: String,
    trim: true,
    maxlength: [50, 'Nome deve ter no máximo 50 caracteres']
  },
  password: { 
    type: String, 
    required: [true, 'Senha é obrigatória'], 
    minlength: [8, 'Senha deve ter no mínimo 8 caracteres'],
    select: false // Não retorna a senha em consultas por padrão
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  active: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
  todos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Todo'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Adiciona automaticamente createdAt e updatedAt
});

// Middleware para hash da senha
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Middleware para atualizar o updatedAt
userSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

// Método para comparar senha
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Plugin para validação de campos únicos
userSchema.plugin(uniqueValidator, { 
  message: 'O {PATH} {VALUE} já está em uso' 
});

// Configuração do toJSON
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.password;
  }
});

// Índices para melhor performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;

const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Título é obrigatório'],
    minlength: [3, 'Título deve ter no mínimo 3 caracteres'],
    maxlength: [100, 'Título deve ter no máximo 100 caracteres'],
    trim: true
  },
  priority: {
    type: String,
    enum: {
      values: ["low", "medium", "high"],
      message: 'Prioridade deve ser low, medium ou high'
    },
    default: "medium"
  },
  description: {
    type: String,
    required: [true, 'Descrição é obrigatória'],
    minlength: [5, 'Descrição deve ter no mínimo 5 caracteres'],
    maxlength: [1000, 'Descrição deve ter no máximo 1000 caracteres'],
    trim: true
  },
  important: {
    type: Boolean,
    default: false
  },
  done: {
    type: Boolean,
    default: false
  },
  dueDate: {
    type: Date,
    validate: {
      validator: function(value) {
        return value > Date.now();
      },
      message: 'Data de vencimento deve ser futura'
    }
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, 'Usuário é obrigatório']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [20, 'Tag deve ter no máximo 20 caracteres']
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
  timestamps: true
});

// Middleware para atualizar o updatedAt
todoSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: new Date() });
  next();
});

// Configuração do toJSON
todoSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

// Índices para melhor performance
todoSchema.index({ user: 1 });
todoSchema.index({ priority: 1 });
todoSchema.index({ done: 1 });
todoSchema.index({ important: 1 });
todoSchema.index({ dueDate: 1 });

const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;

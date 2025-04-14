const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 5,
    required: true,
  },
  priority: {
      type: String, enum: ["low", "medium", "high"],
  },
  description: {
    type: String,
    minlength: 5,
    required: true,
  },
  important: {type: Boolean, default: false},
  done:  {type: Boolean, default: false},
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

todoSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Note", todoSchema);

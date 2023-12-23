const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());
const mongoose = require("mongoose");

const url = `mongodb+srv://genildocs:${"123.Asd1820"}@cluster0.j2e6fqz.mongodb.net/noteApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

const Note = mongoose.model("Note", noteSchema);

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: new Date().toISOString(),
    important: Math.random() < 0.5,
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: new Date().toISOString(),
    important: Math.random() < 0.5,
  },
];

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.post("/api/notes", (request, response) => {
  const body = request.body;
  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date().toISOString(),
    id: generateId(),
  };

  notes = notes.concat(note);
  response.json(note);
});

app.get("/", (req, res) => {
  res.send("<p>Notes api</p>");
});

app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find((note) => note.id === id);
  if (note) {
    response.json(note);
  } else {
    response.statusMessage = `Note with id ${id} not found`;
    response.status(404).end();
  }
});

app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);
  response.status(204).end();
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

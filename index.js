const express = require("express");
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;
const cors = require("cors");

app.use(cors());

let notes = [
  {
    id: 1,
    title: "Title",
    content: "HTML is easy",
    date: new Date().toISOString(),
    important: Math.random() < 0.5,
  },
  {
    id: 2,
    title: "Title",
    content: "Browser can execute only Javascript",
    date: new Date().toISOString(),
    important: Math.random() < 0.5,
  },
  {
    id: 3,
    title: "Title",
    content: "GET and POST are the most important methods of HTTP protocol",
    date: new Date().toISOString(),
    important: Math.random() < 0.5,
  },
  {
    id: 4,
    title: "Title",
    content: "Node.js is a single-threaded application",
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
    title: body.title || "Title",
    content: body.content,
    important: body.important || false,
    date: new Date().toISOString(),
    id: generateId(),
  };

  notes = notes.concat(note);
  response.json(note);
});

app.get("/", (req, res) => {
  res.send("<h1>Notes</h1>");
});

app.get("/api/notes", (req, res) => {
  res.json(notes);
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

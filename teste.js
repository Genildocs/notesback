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
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: new Date().toISOString(),
    important: Math.random() < 0.5,
  },
  {
    id: 4,
    content: "Node.js is a single-threaded application",
    date: new Date().toISOString(),
    important: Math.random() < 0.5,
  },
];
const id = notes[1].id;
const note = notes.find((note) => note.id === id);
console.log(note);
console.log(notes.length + 1);

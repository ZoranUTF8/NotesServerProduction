const express = require("express");
const cors = require("cors");
const app = express();
const { v4: uuidv4 } = require("uuid");
let notes = require("./data/notes.json");
/*
The json-parser functions so that it takes the JSON data of a request, 
transforms it into a JavaScript object and then attaches it to the body
 property of the request object before the route handler is called.*/
app.use(express.json());
//? Serving our static content from the build folder where our react app is
/*
Now HTTP GET requests to the address www.serversaddress.com/index.html
or www.serversaddress.com will show the React frontend. GET requests
to the address www.serversaddress.com/api/notes will be handled by the backend's code.
*/
app.use(express.static("build"));
app.use(cors());
const generateNoteId = () => {
  return uuidv4();
};

//! REQUEST HANDLERS
app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

//! REST VERBS
//? Add update note
//* Get  single note

app.get("/api/notes", (request, response) => {
  response.json(notes);
});

//* Get single note
app.get("/api/notes/:id", (req, res) => {
  const noteId = Number(req.params.id);

  const note = notes.find((singleNote) => singleNote.id === noteId);

  if (note) {
    res.json(note);
  } else {
    res.status(204);
    res.json({ status: "fail", message: `No note with ${noteId}` });
  }
});

//* Delete single note
app.delete("/api/notes/:id", (req, res) => {
  const noteFound = notes.find((note) => note.id === req.params.id);

  if (noteFound) {
    notes = notes.filter((note) => note.id !== noteFound.id);
    res.status(200).send({ message: `Note with id ${req.params.id} deleted` });
  } else {
    res
      .status(404)
      .send({ message: `No notes with id ${req.params.id} found` });
  }
});

//* Add new note
app.post("/api/notes", (req, res) => {
  if (req.body.content) {
    const newNote = {
      content: req.body.content,
      important: req.body.important || false,
      dateAdded: new Date(),
      id: generateNoteId(),
    };

    notes = notes.concat(newNote);
    console.log(notes);
    res
      .status(200)
      .send({ message: `Note added under id ${newNote.id}`, note: newNote });
  } else {
    res.status(400).send({ error: "Bad request, missing content" });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT);

console.log(`Server running on port ${PORT}`);

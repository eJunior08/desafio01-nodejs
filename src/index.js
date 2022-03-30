const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const savedUser = users.find((user) => user.username === username);

  if (!savedUser) {
    return response.status(404).json({ error: "User not found!" });
  }

  request.user = savedUser;

  return next();
}

app.post("/users", (request, response) => {
  const { name, username } = request.body;

  if (!name || !username) {
    return response.status(400).json({ error: "Invalid parameters!" });
  }

  const existsUsername = users.some((user) => user.username === username);

  if (existsUsername) {
    return response.status(400).json({ error: "Username already exists!" });
  }

  const newUser = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  };

  users.push(newUser);

  return response.status(201).json(newUser);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  return response.status(200).json(user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;

  const newTodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  user.todos.push(newTodo);

  return response.status(201).json(newTodo);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;
  const { id } = request.params;

  const { user } = request;
  const savedTodo = user.todos.find((todo) => todo.id === id);

  if (!savedTodo) {
    return response.status(404).json({ error: "Todo not found!" });
  }

  if (title) {
    savedTodo.title = title;
  }

  if (deadline) {
    savedTodo.deadline = new Date(deadline);
  }

  return response.status(201).json(savedTodo);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;

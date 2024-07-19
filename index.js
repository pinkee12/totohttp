const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());

const dbFilePath = './db.json';

const readDB = () => {
  const data = fs.readFileSync(dbFilePath, 'utf8');
  return JSON.parse(data);
};

const writeDB = (data) => {
  fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), 'utf8');
};

app.get('/todos', (req, res) => {
  const db = readDB();
  res.json(db.todos);

 });

app.post('/todos', (req, res) => {
  const { title, status = false } = req.body;
  const db = readDB();
  const newTodo = {
    id: db.todos.length ? db.todos[db.todos.length - 1].id + 1 : 1,
    title,
    status
  };
  db.todos.push(newTodo);
  writeDB(db);
  res.status(201).json(newTodo);
});

app.put('/todos/update-even', (req, res) => {
  const db = readDB();
  db.todos = db.todos.map(todo => {
    if (todo.id % 2 === 0 && !todo.status) {
      todo.status = true;
    }
    return todo;
  });
  writeDB(db);
  res.json(db.todos);
});


app.delete('/todos/delete-true', (req, res) => {
  let db = readDB();
  db.todos = db.todos.filter(todo => !todo.status);
  writeDB(db);
  res.json(db.todos);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const express = require('express');
const socket = require('socket.io');

const app = express();

let tasks = [];

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port: 8000');
});

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});

const io = socket(server);

io.on('connection', (socket) => {
  socket.emit('updateData', tasks);
  console.log('updateData', tasks);

  socket.on('addTask', (newTask) => {
    if (!tasks.find(task => task.id === newTask.id)) {
      tasks.push(newTask);
    }
    socket.broadcast.emit('addTask', newTask);
  });

  socket.on('removeTask', taskId => {
    tasks = tasks.filter((task) => task.id !== taskId);
    socket.broadcast.emit('removeTask', taskId);
  });
});

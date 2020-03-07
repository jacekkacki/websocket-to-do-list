import React from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tasks: [],
      taskName: '',
    };

  }

  componentDidMount() {
    this.socket = io.connect('http://localhost:8000');
    this.socket.on('updateData', tasksList => {this.updateTasksList(tasksList)});
    this.socket.on('addTask', newTask => {this.addTask(newTask)});
    this.socket.on('removeTask', taskId => {this.removeTask(taskId)});
  };
  
  updateTasksList = tasksList => {
    this.setState({ tasks: tasksList});
  };

  addTask = newTask => {
    const { tasks } = this.state;

    if (!tasks.find(task => task.id === newTask.id)) {
      tasks.push(newTask);
      this.setState(tasks);
      this.socket.emit('addTask', newTask);
    }
  };

  removeTask = (id, localTask) => {
    const { tasks } = this.state;
    this.setState({ tasks: tasks.filter(task => task.id !== id)});
    if(localTask){
      this.socket.emit('removeTask', id);
    }
  };

  submitForm = e => {
    e.preventDefault();

    const { taskName } = this.state;
    const newTask = {id: uuidv4(), name: taskName};

    this.addTask(newTask);

    this.setState({taskName: ''});
    this.socket.emit('addTask', newTask);
  };

  render() {
    const { tasks, taskName } = this.state;

    return (
      <div className='App'>
    
        <header>
          <h1>ToDoList.app</h1>
        </header>
    
        <section className='tasks-section' id='tasks-section'>
          <h2>Tasks</h2>
    
          <ul className='tasks-section__list' id='tasks-list'>
            {tasks.map(task => (
              <li className='task' key={task.id}>
                {task.name}
              <button className='btn btn--red' onClick={() =>
                this.removeTask(task.id, true)}>Remove</button></li>
            ))}
          </ul>

          <form id='add-task-form' >
            <input className='text-input' autoComplete='off' type='text' placeholder='Type your description'
            id='task-name' value={taskName} onChange={e => this.setState({ taskName: e.target.value })} />
            <button className='btn' type='submit' onClick={e => this.submitForm(e)}>Add</button>
          </form>
        </section>
      </div>
    );
  };

};

export default App;
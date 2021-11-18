const express = require('express');
const cors = require('cors');
 const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

 const users = [];

function checksExistsUserAccount(request, response, next) {
       const { username } = request.headers;
       const user = users.find((user)=> user.username === username);
     if(!user){

        return  response.status(404).json({"error": "User not exist"})

     }
     request.user = user;
     return next()
}

app.post('/users', (request, response) => {

  const { name, username } = request.body;

  const userAlreadyExist = users.some(
    (user)=> user.username === username);


  if(userAlreadyExist){
     response.status(400).json({'error': "User already exist"})
    }

  const user = {

    name,
    username,
    id: uuidv4(),
    todos: []

  }
    users.push(user);
    response.status(201).json(user);

});

app.get('/todos', checksExistsUserAccount, (request, response) => {

  const { user }  = request;
  
  const { todos } = user;

  return response.json(todos);

});

app.post('/todos', checksExistsUserAccount, (request, response) => {

  const { user } = request;
  const { title, deadline } = request.body;
  
  const createtodo = { 

    id: uuidv4(),
    title,
    done: false, 
    deadline: new Date(deadline),
    created_at: new Date()
  }
     user.todos.push(createtodo);
  
  return response.status(201).json(createtodo);

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {

  const { user } = request;
  const { title, deadline } = request.body;
  const { id } = request.params; 
  const { todos } = user;


 const todosExists =  todos.find((todo)=> todo.id === id)

 if(!todosExists){
     
   return response.status(404).json({"error": "Mensagem de erro"}) 
  
 }
  todosExists.title = title;
  todosExists.deadline = deadline;
  response.status(201).json(todosExists);

});
app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  
  const { user } = request;
  const { id } = request.params;

  const todos = user.todos;

  const todosExists = todos.find((todo)=> todo.id === id);

  if(!todosExists) {
  return response.status(404).json({"error": "Mensagem de erro"});
  }


  todosExists.done = true;

  response.status(201).json(todosExists);


});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {

  const { user } = request;
  const { id } = request.params;

  const todos = user.todos;

  const todosExists = todos.find((todo)=> todo.id === id);

  if(!todosExists) {
  return response.status(404).json({"error": "Mensagem de erro"});
  }


  todos.splice(todosExists, 1);

  response.status(204).json(todos);
  
});

module.exports = app;
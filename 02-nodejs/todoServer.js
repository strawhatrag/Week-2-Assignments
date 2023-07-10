/**
  You need to create an express HTTP server in Node.js which will handle the logic of a todo list app.
  - Don't use any database, just store all the data in an array to store the todo list data (in-memory)
  - Hard todo: Try to save responses in files, so that even if u exit the app and run it again, the data remains (similar to databases)

  Each todo has a title and a description. The title is a string and the description is a string.
  Each todo should also get an unique autogenerated id every time it is created
  The expected API endpoints are defined below,
  1.GET /todos - Retrieve all todo items
    Description: Returns a list of all todo items.
    Response: 200 OK with an array of todo items in JSON format.
    Example: GET http://localhost:3000/todos
    
  2.GET /todos/:id - Retrieve a specific todo item by ID
    Description: Returns a specific todo item identified by its ID.
    Response: 200 OK with the todo item in JSON format if found, or 404 Not Found if not found.
    Example: GET http://localhost:3000/todos/123
    
  3. POST /todos - Create a new todo item
    Description: Creates a new todo item.
    Request Body: JSON object representing the todo item.
    Response: 201 Created with the ID of the created todo item in JSON format. eg: {id: 1}
    Example: POST http://localhost:3000/todos
    Request Body: { "title": "Buy groceries", "completed": false, description: "I should buy groceries" }
    
  4. PUT /todos/:id - Update an existing todo item by ID
    Description: Updates an existing todo item identified by its ID.
    Request Body: JSON object representing the updated todo item.
    Response: 200 OK if the todo item was found and updated, or 404 Not Found if not found.
    Example: PUT http://localhost:3000/todos/123
    Request Body: { "title": "Buy groceries", "completed": true }
    
  5. DELETE /todos/:id - Delete a todo item by ID
    Description: Deletes a todo item identified by its ID.
    Response: 200 OK if the todo item was found and deleted, or 404 Not Found if not found.
    Example: DELETE http://localhost:3000/todos/123

    - For any other route not defined in the server return 404

  Testing the server - run `npm run test-todoServer` command in terminal
 */
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Enable CORS for all routes
app.use(cors());

// Body-parser middleware  - parse application/json
app.use(bodyParser.json());

let todos = [];

////  1. GET /todos
//app.METHOD(PATH, HANDLER)
app.get("/todos", (req, res) => {
  // reccommended to send response in Json format  -- res.send(JSON.stringify(todos));
  res.json(todos); // res.json is more convenient
});

////  2.GET /todos/:id
// : - is a placeholder for params and accessed by req.params
app.get("/todos/:id", (req, res) => {
  // params are always strings , convert em to int as per usecase
  const todoIndex = findIndex(todos, parseInt(req.params.id));

  if (todoIndex === -1) {
    // send empty is default response
    res.status(404).send();
  } else {
    res.json(todos[todoIndex]);
  }
});

//// 3. POST /todos
app.post("/todos", (req, res) => {
  const todo = {
    id: Math.round(Math.random() * 1000),
    title: req.body.title,
    description: req.body.description,
  };

  todos.push(todo);

  //When handling an HTTP request in Express.js, it is essential to send a response back to the client to complete the request-response cycle.
  // Failing to send a response will leave the client waiting indefinitely, as it expects a response from the server.
  res.status(201).json(todos); //chaining methods
});

//// 4. PUT /todos/:id
app.put("/todos/:id", (req, res) => {
  const todoIndex = findIndex(todos, parseInt(req.params.id));

  if (todoIndex === -1) {
    // send empty is default response
    res.status(404).send();
  } else {
    todos[todoIndex].title = req.body.title;
    todos[todoIndex].description = req.body.description;
    res.json(todos[todoIndex]);
  }
});

//// 5. DELETE /todos/:id

app.delete("/todos/:id", (req, res) => {
  const todoIndex = findIndex(todos, parseInt(req.params.id));

  if (todoIndex === -1) {
    // send empty is default response
    res.status(404).send();
  } else {
    todos = removeAtIndex(todos, todoIndex);
    res.status(200).send();
  }
});

app.listen(3000, () => {
  console.log("listening on http://localhost:3000");
});

let findIndex = (arr, id) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === id) {
      return i;
    }
  }
  return -1;
};

let removeAtIndex = (arr, index) => {
  let newArr = [];
  for (let i = 0; i < arr.length; i++) {
    if (i != index) newArr.push(arr[i]);
  }
  return newArr;
};

module.exports = app;

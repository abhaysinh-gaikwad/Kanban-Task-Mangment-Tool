# Kanban-Task-Mangment-Tool

## Overview
This project is a robust RESTful API built with Express.js and MongoDB, featuring JWT-based authentication and Swagger documentation. It supports comprehensive CRUD operations for managing users, tasks, subtasks, and boards, making it a versatile foundation for various applications. The API is structured to facilitate scalability and maintainability and is ready for deployment on platforms like Render.

## Deployed Links
- Backend
```bash
https://all-backend-servers.onrender.com
```
- Swagger Documentation
```bash
https://all-backend-servers.onrender.com/api-docs/
```
- Frontend Live 
```bash
https://kanban-task-mangment-tool.vercel.app/
```
## Tech Stack

- Node.js: JavaScript runtime for building server-side applications.
- Express.js: Web framework for Node.js used for API development.
- TypeScript: Typed superset of JavaScript that adds static types.
- JWT (JSON Web Tokens): Used for securely transmitting information for authentication.
- bcrypt: Library to hash passwords for secure storage.
- MongoDB: NoSQL database for storing application data.
- Mongoose: ODM (Object Data Modeling) library for MongoDB and Node.js.
- Swagger: Tool for documenting and testing APIs.
- dotenv: Module to load environment variables from a .env file into process.env.
- Nodemon: Utility that automatically restarts the node application when file changes are detected.
- Swagger UI Express: Middleware to serve Swagger UI and documentation.
- swagger-jsdoc: Library to generate Swagger documentation from JSDoc comments.

## Features
- User Authentication: Secure user login and signup with JWT.
- Task Management: CRUD operations for tasks and subtasks.
- Board Management: Manage boards associated with tasks.
- API Documentation: Automatically generated Swagger documentation for easy API usage.
- Deployment Ready: Configured for deployment on platforms like Render.

## Installation
#### Follow these steps to set up the project locally:

- Clone the repository:

```bash
git clone https://github.com/abhaysinh-gaikwad/Kanban-Task-Mangment-Tool.git
```

- Navigate to the project directory:

```bash
cd Kanban-Task-Mangment-Tool
```

- Install dependencies:

```bash
npm install
```
- Set up environment variables:

```bash
Create a .env file in the root directory based on the 
.env
  - Add your MongoDB connection URI and JWT secret key to the .env file.
```
- Run the server:

```bash
npm start
```
### API Documentation
-Access the Swagger UI for detailed API documentation at the deployed URL:

```bash
https://all-backend-servers.onrender.com/api-docs/
```
- For local development, after starting the server, visit:

```bash
http://localhost:4000/api-docs
```

## Endpoints

### User Routes

- Signup: POST /users/signup
Registers a new user.

- Login: POST /users/login
Authenticates an existing user and returns a JWT.

- Logout: GET /users/logout
Logs out the currently authenticated user.

- User Details: GET /users/details
Retrieves details of the currently authenticated user.

### Task Routes

- Create Task: POST /tasks
Adds a new task to the system.

- Get All Tasks: GET /tasks
Retrieves a list of all tasks.

- Get Task by ID: GET /tasks/:id
Fetches details of a specific task by its ID.

- Update Task: PATCH /tasks/:id
Updates a task's details using its ID.

- Delete Task: DELETE /tasks/:id
Deletes a task using its ID.

### Subtask Routes

- Create Subtask: POST /subtasks
Adds a new subtask to a task.

- Get All Subtasks: GET /subtasks
Retrieves a list of all subtasks.

- Get Subtask by ID: GET /subtasks/:id
Fetches details of a specific subtask by its ID.

- Update Subtask: PATCH /subtasks/:id
Updates a subtask's details using its ID.

- Delete Subtask: DELETE /subtasks/:id
Deletes a subtask using its ID.

### Board Routes

- Create Board: POST /boards
Adds a new board to the system.

- Get All Boards: GET /boards
Retrieves a list of all boards.

- Get Board by ID: GET /boards/:id
Fetches details of a specific board by its ID.

- Update Board: PATCH /boards/:id
Updates a board's details using its ID.

- Delete Board: DELETE /boards/:id
Deletes a board using its ID.


## Running Locally
- Start the server:

```bash
npm start
```
- Locally at:
```bash
http://localhost:4000
```
- View the Swagger documentation:

Locally at:
```bash
http://localhost:4000/api-docs
```
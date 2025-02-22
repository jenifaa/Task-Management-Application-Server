# Task Management Backend

## Short Description
This is the backend for the Task Management application built with Node.js, Express.js, and MongoDB. It supports the creation, editing, deletion, and management of tasks with categories such as "To-Do," "In Progress," and "Done." It also supports user authentication via JWT and provides APIs to interact with the tasks in real time. This backend integrates with a React frontend for a seamless user experience.

## Live Links
- **Live App**: https://task-management-server-nine-theta.vercel.app

## Dependencies
- `express`: Web framework for Node.js
- `mongoDB`: MongoDB ORM
- `dotenv`: To manage environment variables
- `cors`: To enable cross-origin requests
- `axios`: HTTP client for API requests
- `nodemon`: For development, auto-restarting the server

## Installation Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/task-management-backend.git
   ```

 2.Navigate to the project folder:
```bash

cd task-management-backend
```
3. Install dependencies:
```bash
npm install
```
4. Create a .env file in the root directory and add the following environment variables: 
```MONGO_URI=your_mongo_database_url
JWT_SECRET=your_jwt_secret
PORT=your_preferred_port
```
5.Run the server:
```bash
nodemon index.js
```
The server should now be running at http://localhost:PORT.

## Technologies Used
Node.js: JavaScript runtime for server-side development
Express.js: Web framework for Node.js
MongoDB: NoSQL database for storing task and user data
dotenv: For managing environment variables securely
Axios: For making HTTP requests
CORS: For enabling cross-origin requests
Nodemon: For automatically restarting the server during development


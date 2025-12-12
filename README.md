# Todo List Application

A full-stack Todo List application built with Node.js, Express, MongoDB, and vanilla JavaScript.

## Features

- Add new todos
- Mark todos as complete/incomplete
- Delete todos
- Responsive design
- Real-time updates
- Persistent storage with MongoDB

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- MongoDB Atlas account or local MongoDB instance

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd todo-list-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Create a `.env` file in the root directory
   - Add your MongoDB connection string:
     ```
     MONGODB_URI=your_mongodb_connection_string_here
     PORT=3000
     ```
   - For local MongoDB, you can use:
     ```
     MONGODB_URI=mongodb://localhost:27017/todoapp
     ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   This will start the server with nodemon for automatic reloading.

5. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
.
├── server.js         # Express server setup and API endpoints
├── package.json     # Project dependencies and scripts
├── .env             # Environment variables (not committed to version control)
├── .gitignore       # Files and directories to ignore
├── public/          # Frontend files
│   ├── index.html   # Main HTML file
│   ├── styles.css   # CSS styles
│   └── app.js       # Frontend JavaScript
└── README.md        # This file
```

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon

## Technologies Used

- **Backend**: Node.js, Express
- **Database**: MongoDB with Mongoose ODM
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Development Tools**: Nodemon

## License

This project is open source and available under the [MIT License](LICENSE).

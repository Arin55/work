const { MongoClient } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI;

// Connect to MongoDB
async function connectToDatabase() {
  const client = new MongoClient(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  return client.db('todoapp').collection('todos');
}

// Get all todos
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await connectToDatabase();
    const result = await todos.find().sort({ createdAt: -1 }).toArray();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new todo
app.post('/api/todos', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    const todos = await connectToDatabase();
    const result = await todos.insertOne({
      text,
      completed: false,
      createdAt: new Date()
    });
    
    res.status(201).json(result.ops[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle todo completion
app.patch('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const todos = await connectToDatabase();
    const todo = await todos.findOne({ _id: require('mongodb').ObjectID(id) });
    
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    const result = await todos.updateOne(
      { _id: require('mongodb').ObjectID(id) },
      { $set: { completed: !todo.completed } }
    );
    
    res.json({ ...todo, completed: !todo.completed });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a todo
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const todos = await connectToDatabase();
    await todos.deleteOne({ _id: require('mongodb').ObjectID(id) });
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Handle all other routes
app.all('*', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Export the serverless function
module.exports = app;

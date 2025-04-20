import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sample data
const sampleData = [
  { id: 1, name: 'Item 1', description: 'Description for Item 1' },
  { id: 2, name: 'Item 2', description: 'Description for Item 2' },
  { id: 3, name: 'Item 3', description: 'Description for Item 3' }
];

// API routes
app.get('/api/items', (req, res) => {
  res.json({
    success: true,
    data: sampleData
  });
});

app.get('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const item = sampleData.find(item => item.id === id);
  
  if (!item) {
    return res.status(404).json({
      success: false,
      error: 'Item not found'
    });
  }
  
  res.json({
    success: true,
    data: item
  });
});

app.post('/api/items', (req, res) => {
  const { name, description } = req.body;
  
  if (!name) {
    return res.status(400).json({
      success: false,
      error: 'Name is required'
    });
  }
  
  const newItem = {
    id: sampleData.length + 1,
    name,
    description: description || ''
  };
  
  res.status(201).json({
    success: true,
    data: newItem
  });
});

// Health check
app.get('/.netlify/functions/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Default route
app.get('/.netlify/functions/api', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the Serverless API',
    version: '1.0.0'
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: {
      message: err.message,
      status: err.status || 500
    }
  });
});

// Export handler for serverless
export const handler = serverless(app);
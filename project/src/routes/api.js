import express from 'express';
import { logger } from '../utils/logger.js';

export const apiRouter = express.Router();

// API version
const API_VERSION = 'v1';

// Sample data
const sampleData = [
  { id: 1, name: 'Item 1', description: 'Description for Item 1' },
  { id: 2, name: 'Item 2', description: 'Description for Item 2' },
  { id: 3, name: 'Item 3', description: 'Description for Item 3' }
];

// GET /api/v1/items
apiRouter.get(`/${API_VERSION}/items`, (req, res) => {
  logger.info('Fetching all items');
  res.json({
    success: true,
    data: sampleData
  });
});

// GET /api/v1/items/:id
apiRouter.get(`/${API_VERSION}/items/:id`, (req, res) => {
  const id = parseInt(req.params.id);
  logger.info(`Fetching item with id: ${id}`);
  
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

// POST /api/v1/items
apiRouter.post(`/${API_VERSION}/items`, (req, res) => {
  const { name, description } = req.body;
  logger.info('Creating new item');
  
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
  
  // In a real app, you would save to a database here
  
  res.status(201).json({
    success: true,
    data: newItem
  });
});

// API documentation endpoint
apiRouter.get('/docs', (req, res) => {
  res.json({
    apiVersion: API_VERSION,
    endpoints: [
      { method: 'GET', path: `/api/${API_VERSION}/items`, description: 'Get all items' },
      { method: 'GET', path: `/api/${API_VERSION}/items/:id`, description: 'Get item by ID' },
      { method: 'POST', path: `/api/${API_VERSION}/items`, description: 'Create a new item' }
    ]
  });
});
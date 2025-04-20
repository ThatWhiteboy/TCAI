# Modern Node.js Project

A modern Node.js project with comprehensive setup for development, testing, and deployment.

## Features

- Express.js REST API
- ES Modules support
- Webpack bundling
- Jest testing
- ESLint & Prettier code formatting
- Winston logging
- Netlify serverless functions
- Docker support
- CI/CD ready

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name
```

2. Install dependencies
```bash
npm install
```

3. Create environment file
```bash
cp .env.example .env
```

4. Start development server
```bash
npm run dev
```

The server will be running at http://localhost:3000

## API Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check
- `GET /api/v1/items` - Get all items
- `GET /api/v1/items/:id` - Get item by ID
- `POST /api/v1/items` - Create a new item
- `GET /api/docs` - API documentation

## Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with hot reloading
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Lint code
- `npm run lint:fix` - Lint and fix code
- `npm run format` - Format code with Prettier
- `npm run netlify:build` - Build for Netlify
- `npm run netlify:deploy` - Deploy to Netlify

## Deployment

### Netlify

This project is configured for easy deployment to Netlify:

1. Connect your repository to Netlify
2. Netlify will automatically detect the configuration
3. Deploy!

## License

This project is licensed under the MIT License - see the LICENSE file for details.
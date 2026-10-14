const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const connectDB = require('./src/config/db');
const { notFound, errorHandler } = require('./src/middlewares/errorMiddleware');

// Route imports
const authRoutes = require('./src/routes/authRoutes');
const documentRoutes = require('./src/routes/documentRoutes');
const agentRoutes = require('./src/routes/agentRoutes');
const researchRoutes = require('./src/routes/researchRoutes');

// Initialize database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Static folder for uploaded research documents/PDFs
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root & Health routes
app.get('/', (req, res) => {
  res.json({
    project: 'Multi-Agent Research Pipeline Backend',
    version: '1.0.0 (Phase 1)',
    status: 'online',
    architecture: 'Modular Multi-Agent Pipeline',
    documentation: {
      auth: '/api/v1/auth',
      documents: '/api/v1/documents',
      agents: '/api/v1/agents',
      research: '/api/v1/research',
    },
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/documents', documentRoutes);
app.use('/api/v1/agents', agentRoutes);
app.use('/api/v1/research', researchRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Research Pipeline Backend running on port ${PORT}`);
  console.log(`📡 Base URL: http://localhost:${PORT}`);
  console.log(`🩺 Health check: http://localhost:${PORT}/health`);
  console.log(`=======================================================`);
});

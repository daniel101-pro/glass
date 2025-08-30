import 'dotenv/config';
import http from 'http';
import app from './server.js';
import { getEnv } from './config/env.js';
import { connectDB } from './config/database.js';

const { PORT } = getEnv();

// Connect to MongoDB before starting the server
const startServer = async () => {
  try {
    await connectDB();
    
    const server = http.createServer(app);
    
    server.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

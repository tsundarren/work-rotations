import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

let isConnected = false; // Track the connection status

export async function connectToDatabase() {
  if (isConnected) {
    console.log('✅ Using existing MongoDB connection');
    return;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI);

    isConnected = db.connections[0].readyState === 1;
    console.log('🚀 Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    throw new Error('MongoDB connection failed');
  }
}

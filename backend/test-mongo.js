import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://falodun379_db_user:Gbl8gHjEgpVs9OwG@cluster0.byybzog.mongodb.net/glass?retryWrites=true&w=majority&appName=Cluster0';

async function testConnection() {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Successfully connected to MongoDB Atlas!');
    
    // Test creating a simple document
    const testSchema = new mongoose.Schema({ message: String });
    const Test = mongoose.model('Test', testSchema);
    
    const doc = new Test({ message: 'Hello from Glass backend!' });
    await doc.save();
    console.log('✅ Successfully created test document');
    
    // Clean up
    await Test.deleteOne({ _id: doc._id });
    console.log('✅ Test document cleaned up');
    
    await mongoose.connection.close();
    console.log('✅ Connection closed successfully');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
  }
}

testConnection();


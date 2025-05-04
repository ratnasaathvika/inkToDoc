const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
    try {
        console.log('Attempting to connect to MongoDB...');
        
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/inkToDoc', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log('Successfully connected to MongoDB!');
        
        // Test database operations
        const db = mongoose.connection;
        console.log('Database name:', db.name);
        console.log('Database collections:', await db.db.listCollections().toArray());
        
        // Close the connection
        await mongoose.connection.close();
        console.log('Connection closed.');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
}

testConnection(); 
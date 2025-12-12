require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing MongoDB connection...');

// Get MongoDB URI from environment or use default
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/todoapp';
console.log('Connection string being used (password hidden):', 
    mongoUri.replace(/mongodb+s?:\/\/([^:]+):[^@]+@/, 'mongodb://$1:****@')
);

// Test connection
async function testConnection() {
    try {
        // Set a connection timeout
        const timeout = 5000; // 5 seconds
        const connectionPromise = mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: timeout
        });

        // Set a timeout for the connection attempt
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error(`Connection timeout after ${timeout}ms`));
            }, timeout);
        });

        // Race the connection against the timeout
        await Promise.race([connectionPromise, timeoutPromise]);
        
        console.log('✅ Successfully connected to MongoDB!');
        console.log('MongoDB Server Version:', mongoose.connection.version);
        
        // List all collections to verify access
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('\nAvailable collections:');
        collections.forEach(coll => console.log(`- ${coll.name}`));
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error connecting to MongoDB:', error.message);
        
        // Check if it's a connection string format issue
        if (error.name === 'MongoParseError') {
            console.error('\n⚠️  Connection string format error. Please check:');
            console.error('1. The connection string starts with mongodb:// or mongodb+srv://');
            console.error('2. The username and password are properly URL-encoded');
            console.error('3. The hostname is correct and accessible');
        }
        
        // Check network connectivity
        console.error('\n🔍 Troubleshooting:');
        console.error('1. Is your MongoDB server running and accessible?');
        console.error('2. If using MongoDB Atlas, is your IP whitelisted?');
        console.error('3. Is your internet connection stable?');
        
        process.exit(1);
    }
}

testConnection();

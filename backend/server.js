require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(express.json());

let cachedDb = null;

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.warn('MONGODB_URI not set in environment variables');
    return null;
  }

  // Return cached connection if available
  if (cachedDb && mongoose.connection.readyState === 1) {
    console.log('Using cached MongoDB connection');
    return cachedDb;
  }

  try {
    // Optimized settings for Vercel serverless
    const options = {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000,
      maxPoolSize: 10, // Limit connection pool
      minPoolSize: 1,
      maxIdleTimeMS: 10000,
      retryWrites: true,
      w: 'majority'
    };

    await mongoose.connect(uri, options);
    cachedDb = mongoose.connection;
    console.log('MongoDB connected successfully');
    return cachedDb;
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    return null;
  }
}

// Connect on startup
connectDB();

//Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, unique: true, sparse: true },
  password: { type: String, required: true }
});
const User = mongoose.models.User || mongoose.model('User', userSchema);

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from parent directory (root folder)
app.use(express.static(path.join(__dirname, '..')));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date(),
    message: 'Backend is running!',
    env_check: process.env.MONGODB_URI ? 'MONGODB_URI is set' : 'MONGODB_URI is missing'
  });
});

app.post("/login",async (req,res)=>{
  try{
    const {username,password} = req.body;
    if(!username || !password)  return res.status(400).json({status : 'error'});
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const user = emailRegex.test(username)
      ? await User.findOne({ email: username })
      : await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.json({ status: 'nouser' });
    }
    res.json({ status: 'success', wt_user: {username : user.username, email: user.email}});
  }
  catch (err){
    console.error(err);
    // console.error(req.body);
    res.status(500).json({status:'error'});
  }
});

app.post("/signup",async (req,res)=>{
  try{
    const { username,email,password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ status: 'error' });
    }
    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      return res.json({ status: 'exists' });
    }
    const hashed = await bcrypt.hash(password, 10);
    await new User({ username, email, password: hashed }).save();
    res.json({ status: 'success' });
  }
  catch(err){
    console.error('Signup error:', err);
    res.status(500).json({ status: 'error' });
  }
});

app.listen(5500, ()=>{
  console.log("Server running on port 5500");
});

module.exports = app;
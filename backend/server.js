require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(express.json());
app.use(cors());

// Static files
app.use('/assets', express.static(path.join(__dirname, '../assets')));
app.use('/frontend', express.static(path.join(__dirname, '../frontend')));
app.use(express.static(path.join(__dirname, '../frontend/home')));

let cachedDb = null;

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.warn('MONGODB_URI not set');
    return null;
  }
  
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }
  
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    cachedDb = mongoose.connection;
    console.log('MongoDB connected');
    return cachedDb;
  } catch (err) {
    console.error('MongoDB error:', err.message);
    return null;
  }
}

// Cloudinary config
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL
  });
}

// Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, unique: true, sparse: true },
  password: { type: String, required: true }
});
const User = mongoose.models.User || mongoose.model('User', userSchema);

// Import Product model
const Product = require('./models/productSchema.js');

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/home/home.html'));
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date(),
    message: 'Backend is running!'
  });
});

app.post("/login", async (req, res) => {
  try {
    await connectDB();
    
    const {username, password} = req.body;
    if (!username || !password) return res.status(400).json({status: 'error'});
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const user = emailRegex.test(username)
      ? await User.findOne({ email: username })
      : await User.findOne({ username });
      
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.json({ status: 'nouser' });
    }
    
    res.json({ status: 'success', wt_user: {username: user.username, email: user.email}});
  } catch (err) {
    console.error(err);
    res.status(500).json({status: 'error'});
  }
});

app.post("/signup", async (req, res) => {
  try {
    await connectDB();
    
    const {username, email, password} = req.body;
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
  } catch(err) {
    console.error('Signup error:', err);
    res.status(500).json({ status: 'error' });
  }
});

app.get('/api/products/:username', async (req, res) => {
  try {
    await connectDB();
    
    const productsData = Product ? await Product.findOne({username: req.params.username}) : null;
    res.json({
      tees: productsData?.tees || [],
      hoodies: productsData?.hoodies || [],
      cargos: productsData?.cargos || [],
      shirts: productsData?.shirts || [],
      jeans: productsData?.jeans || [],
      joggers: productsData?.joggers || []
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({status: 'error'});
  }
});

app.post('/api/upload', upload.single('image'), async(req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    res.json({ url: result.secure_url });
  } catch (err) {
    res.status(500).json(err);
  }
});

app.post('/api/saveProduct', async (req, res) => {
  try {
    await connectDB();
    
    const {prevType, productId, username, arr, newPro} = req.body;
    let array = arr;
    let type = newPro.productType;
    
    if (productId != null && prevType != null) {
      array[prevType] = array[prevType].filter(p => p._id != productId);
      array[type].push({...newPro, productId: productId});
    } else {
      array[type].push(newPro);
    }

    if (!username) return res.status(400).json({success: false, reply: "where is the username ??"});
    
    const product = await Product.findOne({username});
    
    if (!product) {
      await new Product({username, [type]: array[type]}).save();
      return res.json({success: true});
    }
    
    if (prevType != type) {
      await Product.findOneAndUpdate({username}, {[prevType]: array[prevType]});
    }
    
    await Product.findOneAndUpdate({username}, {[newPro.productType]: array[newPro.productType]});
    
    return res.json({success: true});
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

app.post('/api/deleteProduct', async(req, res) => {
  try {
    await connectDB();
    
    const {username, arr, productType} = req.body;
    
    if (!username) return res.status(400).json({success: false, reply: "where is the username ??"});
    
    const product = await Product.findOne({username});
    if (!product) {
      return res.status(400).json({success: false});
    }
    
    await Product.findOneAndUpdate({username}, {[productType]: arr[productType]});
    return res.json({success: true});
  } catch(err) {
    console.error(err);
    return res.status(500).json({success: false});
  }
});

// Don't listen in production
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
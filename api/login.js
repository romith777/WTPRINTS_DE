import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

let cachedClient = null;

async function connectToDatabase() {
  if (cachedClient) return cachedClient;
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  cachedClient = client;
  return client;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ status: 'error', message: 'Username and password are required' });
    }

    const client = await connectToDatabase();
    const db = client.db();

    // Find user by username or email
    const user = await db.collection('users').findOne({
      $or: [{ username }, { email: username }]
    });

    if (!user) {
      return res.status(401).json({ status: 'nouser', message: 'Invalid username or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ status: 'nouser', message: 'Invalid username or password' });
    }

    // Issue a JWT with username so Orders API can filter by brandName
    const token = jwt.sign(
      { userId: user._id.toString(), username: user.username, email: user.email },
      process.env.JWT_SECRET || 'fallback-de-secret',
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      status: 'success',
      token,
      user: { username: user.username, email: user.email }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
}

import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

let cachedDeClient = null;
let cachedWtpClient = null;

async function connectDE() {
  if (cachedDeClient) return cachedDeClient;
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  cachedDeClient = client;
  return client;
}

async function connectWTP() {
  if (cachedWtpClient) return cachedWtpClient;
  const uri = process.env.WTPRINTS_MONGODB_URI;
  if (!uri) throw new Error('WTPRINTS_MONGODB_URI not set');
  const client = await MongoClient.connect(uri);
  cachedWtpClient = client;
  return client;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // ── 1. Authenticate seller ──
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    let sellerUsername;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-de-secret');
      sellerUsername = decoded.username;
    } catch {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { orderId, newStatus } = req.body;
    if (!orderId || !newStatus) {
      return res.status(400).json({ error: 'orderId and newStatus are required' });
    }

    const VALID_STATUSES = [
      'Processing', 'Packed', 'Shipped to Hub',
      'Delivered to Hub', 'Consolidated', 'Dispatched to Buyer', 'Delivered'
    ];
    if (!VALID_STATUSES.includes(newStatus)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    // ── 2. Update in DE DB (seller_orders collection) ──
    const deClient = await connectDE();
    const deDb = deClient.db();

    // Verify this order belongs to this seller before updating
    const deOrder = await deDb.collection('seller_orders').findOne({
      _id: new ObjectId(orderId),
      sellerUsername,
    });

    if (!deOrder) {
      return res.status(403).json({ error: 'Order not found or access denied' });
    }

    await deDb.collection('seller_orders').updateOne(
      { _id: new ObjectId(orderId) },
      { $set: { status: newStatus, updatedAt: new Date() } }
    );

    // ── 3. Also update in main WTPrints DB so buyer sees it ──
    try {
      const wtpClient = await connectWTP();
      const wtpDb = wtpClient.db('wtprints');

      const originalId = deOrder.originalOrderId;
      if (originalId) {
        await wtpDb.collection('orders').updateOne(
          { _id: new ObjectId(originalId) },
          { $set: { status: newStatus, updatedAt: new Date() } }
        );
      }
    } catch (wtpErr) {
      // Don't fail the whole request if the WTP write fails
      // DE DB is updated, which is the seller's source of truth
      console.warn('Failed to sync status to WTPrints main DB:', wtpErr.message);
    }

    return res.status(200).json({ success: true, newStatus });

  } catch (error) {
    console.error('update-order-status error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}

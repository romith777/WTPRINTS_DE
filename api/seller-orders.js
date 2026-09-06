import { MongoClient } from 'mongodb';
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
  if (!uri) throw new Error('WTPRINTS_MONGODB_URI not set in environment variables');
  const client = await MongoClient.connect(uri);
  cachedWtpClient = client;
  return client;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

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

    if (!sellerUsername) {
      return res.status(400).json({ error: 'Token missing username' });
    }

    // ── 2. Pull fresh orders from WTPrints main DB ──
    const wtpClient = await connectWTP();
    const wtpDb = wtpClient.db('wtprints');

    // Orders where at least one cart item's brandName matches this seller
    const allOrders = await wtpDb.collection('orders')
      .find({
        'cart.brandName': sellerUsername
      })
      .sort({ createdAt: -1 })
      .limit(200)
      .toArray();

    // Filter each order's cart to only this seller's items
    const sellerOrders = allOrders.map(order => ({
      ...order,
      myItems: (order.cart || []).filter(
        item => item.brandName === sellerUsername
      ),
    }));

    // ── 3. Upsert into WTPrints-DE DB (seller_orders collection) ──
    const deClient = await connectDE();
    const deDb = deClient.db(); // uses default DB from connection string

    if (sellerOrders.length > 0) {
      const ops = sellerOrders.map(order => ({
        updateOne: {
          filter: { originalOrderId: order._id.toString() },
          update: {
            $set: {
              originalOrderId: order._id.toString(),
              sellerUsername,
              userEmail: order.userEmail,
              shippingDetails: order.shippingDetails,
              myItems: order.myItems,
              amount: order.amount,
              createdAt: order.createdAt,
            },
            $setOnInsert: {
              // Only set status on first insert — don't override seller's updates
              status: order.status || 'Processing',
            }
          },
          upsert: true,
        }
      }));

      await deDb.collection('seller_orders').bulkWrite(ops);
    }

    // ── 4. Return the DE DB copy (seller may have changed statuses here) ──
    const finalOrders = await deDb.collection('seller_orders')
      .find({ sellerUsername })
      .sort({ createdAt: -1 })
      .toArray();

    // Apply status filter if ?status= param given
    const statusFilter = req.query.status;
    const result = statusFilter
      ? finalOrders.filter(o => o.status === statusFilter)
      : finalOrders;

    return res.status(200).json({ success: true, orders: result });

  } catch (error) {
    console.error('seller-orders error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}

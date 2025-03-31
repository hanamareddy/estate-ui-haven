
const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');
const { MongoClient, ObjectId } = require('mongodb');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(MONGODB_URI);
let db;

// Connect to MongoDB
async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db("estateHub");
    console.log("Connected to MongoDB from DB routes");
  }
  return db;
}

// Helper to handle ObjectId conversion
const handleObjectId = (obj) => {
  if (!obj) return obj;
  
  if (typeof obj === 'string' && ObjectId.isValid(obj)) {
    return new ObjectId(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => handleObjectId(item));
  }
  
  if (typeof obj === 'object') {
    const result = {};
    for (const key in obj) {
      // Special handling for _id and any field ending with _id
      if (key === '_id' || key === 'id' || key.endsWith('_id')) {
        if (ObjectId.isValid(obj[key])) {
          result[key] = new ObjectId(obj[key]);
        } else {
          result[key] = obj[key];
        }
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        result[key] = handleObjectId(obj[key]);
      } else {
        result[key] = obj[key];
      }
    }
    return result;
  }
  
  return obj;
};

// Normalize MongoDB _id to id
const normalizeId = (data) => {
  if (!data) return data;
  
  if (Array.isArray(data)) {
    return data.map(item => normalizeId(item));
  }
  
  if (typeof data === 'object' && data !== null) {
    const result = { ...data };
    
    if (result._id) {
      result.id = result._id.toString();
      delete result._id;
    }
    
    Object.keys(result).forEach(key => {
      if (typeof result[key] === 'object' && result[key] !== null) {
        result[key] = normalizeId(result[key]);
      }
    });
    
    return result;
  }
  
  return data;
};

// Parse query parameters to MongoDB query
const parseQuery = (query) => {
  const result = {};
  
  for (const key in query) {
    if (key === 'id') {
      result['_id'] = new ObjectId(query[key]);
    } else if (key.endsWith('_id') && ObjectId.isValid(query[key])) {
      result[key] = new ObjectId(query[key]);
    } else {
      result[key] = query[key];
    }
  }
  
  return result;
};

// Get all documents from a collection
router.get('/:collection', authenticateUser, async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection(req.params.collection);
    const query = parseQuery(req.query);
    
    const documents = await collection.find(query).toArray();
    res.json(normalizeId(documents));
  } catch (error) {
    console.error(`Error in GET /${req.params.collection}:`, error);
    res.status(500).json({ message: error.message });
  }
});

// Get a single document from a collection
router.get('/:collection/findOne', authenticateUser, async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection(req.params.collection);
    const query = parseQuery(req.query);
    
    const document = await collection.findOne(query);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    res.json(normalizeId(document));
  } catch (error) {
    console.error(`Error in GET /${req.params.collection}/findOne:`, error);
    res.status(500).json({ message: error.message });
  }
});

// Insert a document into a collection
router.post('/:collection', authenticateUser, async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection(req.params.collection);
    const document = handleObjectId(req.body);
    
    const result = await collection.insertOne(document);
    res.status(201).json({
      insertedId: result.insertedId.toString(),
      acknowledged: result.acknowledged
    });
  } catch (error) {
    console.error(`Error in POST /${req.params.collection}:`, error);
    res.status(500).json({ message: error.message });
  }
});

// Update a document in a collection
router.put('/:collection', authenticateUser, async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection(req.params.collection);
    const { filter, update } = req.body;
    
    const result = await collection.updateOne(
      handleObjectId(filter),
      handleObjectId(update)
    );
    
    res.json({
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount,
      acknowledged: result.acknowledged
    });
  } catch (error) {
    console.error(`Error in PUT /${req.params.collection}:`, error);
    res.status(500).json({ message: error.message });
  }
});

// Update multiple documents in a collection
router.put('/:collection/many', authenticateUser, async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection(req.params.collection);
    const { filter, update } = req.body;
    
    const result = await collection.updateMany(
      handleObjectId(filter),
      handleObjectId(update)
    );
    
    res.json({
      modifiedCount: result.modifiedCount,
      matchedCount: result.matchedCount,
      acknowledged: result.acknowledged
    });
  } catch (error) {
    console.error(`Error in PUT /${req.params.collection}/many:`, error);
    res.status(500).json({ message: error.message });
  }
});

// Delete a document from a collection
router.delete('/:collection', authenticateUser, async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection(req.params.collection);
    const query = parseQuery(req.query);
    
    const result = await collection.deleteOne(query);
    res.json({
      deletedCount: result.deletedCount,
      acknowledged: result.acknowledged
    });
  } catch (error) {
    console.error(`Error in DELETE /${req.params.collection}:`, error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

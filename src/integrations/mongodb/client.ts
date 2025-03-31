
// This file is for browser-side MongoDB operations and will redirect to the backend API
// when running in browser environment

import { connectToDatabase as connectToBrowserDB, collections, normalizeId, ObjectId as BrowserObjectId } from './browser-client';

// Debug info
console.log("MongoDB client initializing with browser-based API client");

// Export collections
export { collections, normalizeId };

// Export ObjectId - use the browser implementation
export const ObjectId = BrowserObjectId;

// Simplified connection function that only uses the browser implementation
export async function connectToDatabase() {
  console.log("Using browser MongoDB client (via API)");
  return connectToBrowserDB();
}

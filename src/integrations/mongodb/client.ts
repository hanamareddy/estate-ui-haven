
// Redirect all MongoDB operations to the backend API
// This file exists only for compatibility with existing imports

console.log("MongoDB client redirecting to backend API");

// Dummy functions to maintain API compatibility
export const collections = {
  users: 'users',
  profiles: 'profiles',
  properties: 'properties',
  favorites: 'favorites',
  inquiries: 'property_inquiries',
  notifications: 'user_notifications',
};

export const ObjectId = function(id?: string) {
  this.id = id || 'id_' + Math.random().toString(36).substring(2, 15);
  this.toString = function() { return this.id; };
  this.toHexString = function() { return this.id; };
};

export function normalizeId(data: any): any {
  return data;
}

// Return a dummy connection that will redirect to the API
export async function connectToDatabase() {
  console.warn("Direct MongoDB access from frontend is disabled. Use API instead.");
  return null;
}

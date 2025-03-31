
import api from '@/services/api';

// Define collections to match server-side naming
export const collections = {
  users: 'users',
  profiles: 'profiles',
  properties: 'properties',
  favorites: 'favorites',
  inquiries: 'property_inquiries',
  notifications: 'user_notifications',
};

// Simulate MongoDB ObjectId for browser environment
export class ObjectId {
  private id: string;

  constructor(id?: string) {
    this.id = id || this.generateId();
  }

  private generateId(): string {
    // Simple ID generator for browser - not the same as MongoDB's but works for our purposes
    return 'id_' + Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  toString(): string {
    return this.id;
  }

  toHexString(): string {
    return this.id;
  }
}

// Helper to normalize MongoDB _id to id
export function normalizeId(data: any): any {
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
}

// Browser-side implementation that uses API
export async function connectToDatabase() {
  console.log("Browser MongoDB client connecting via API");
  
  // Return a simplified database interface that forwards requests to the API
  return {
    collection: (collectionName: string) => ({
      find: (query = {}) => ({
        sort: (sortOptions = {}) => ({
          toArray: async () => {
            const queryString = new URLSearchParams(
              Object.entries(query).map(([key, value]) => [key, String(value)])
            ).toString();
            
            const response = await api.get(`/db/${collectionName}?${queryString}`);
            return response.data;
          }
        }),
        project: (projection = {}) => ({
          toArray: async () => {
            const queryString = new URLSearchParams(
              Object.entries(query).map(([key, value]) => [key, String(value)])
            ).toString();
            
            const response = await api.get(`/db/${collectionName}?${queryString}`);
            return response.data;
          }
        }),
        toArray: async () => {
          const queryString = new URLSearchParams(
            Object.entries(query).map(([key, value]) => [key, String(value)])
          ).toString();
          
          const response = await api.get(`/db/${collectionName}?${queryString}`);
          return response.data;
        }
      }),
      findOne: async (query = {}) => {
        const queryString = new URLSearchParams(
          Object.entries(query).map(([key, value]) => [key, String(value)])
        ).toString();
        
        const response = await api.get(`/db/${collectionName}/findOne?${queryString}`);
        return response.data;
      },
      insertOne: async (document: any) => {
        const response = await api.post(`/db/${collectionName}`, document);
        return {
          insertedId: response.data.insertedId,
          acknowledged: true
        };
      },
      updateOne: async (filter: any, update: any) => {
        const response = await api.put(`/db/${collectionName}`, {
          filter,
          update
        });
        return response.data;
      },
      deleteOne: async (filter: any) => {
        const queryString = new URLSearchParams(
          Object.entries(filter).map(([key, value]) => [key, String(value)])
        ).toString();
        
        const response = await api.delete(`/db/${collectionName}?${queryString}`);
        return response.data;
      },
      updateMany: async (filter: any, update: any) => {
        const response = await api.put(`/db/${collectionName}/many`, {
          filter,
          update
        });
        return response.data;
      }
    })
  };
}

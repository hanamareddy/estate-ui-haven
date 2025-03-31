
import api from './api';

export const cloudinaryService = {
  // Upload a single image
  uploadImage: async (file: File): Promise<{ imageUrl: string; public_id: string }> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      imageUrl: response.data.imageUrl,
      public_id: response.data.public_id
    };
  },

  // Upload multiple images
  uploadImages: async (files: File[]): Promise<Array<{ url: string; public_id: string }>> => {
    const formData = new FormData();
    
    files.forEach((file) => {
      formData.append('images', file);
    });

    const response = await api.post('/upload/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.images;
  },

  // Delete an image
  deleteImage: async (publicId: string): Promise<{ success: boolean }> => {
    const response = await api.delete(`/upload/image/${publicId}`);
    return response.data;
  }
};

export default cloudinaryService;

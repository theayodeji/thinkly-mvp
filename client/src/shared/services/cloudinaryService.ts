// src/shared/services/cloudinaryService.ts
export const uploadToCloudinary = async (file: File): Promise<{ secure_url: string; public_id: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append('cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
  
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/auto/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Upload failed');
      }
  
      return response.json();
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error('Failed to upload file. Please try again.');
    }
  };

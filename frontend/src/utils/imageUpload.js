import api from './Api/axiosInstance';

export const uploadProfileImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('profileImage', file);
    
    const response = await api.patch('/api/user/profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Image upload error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to upload image',
    };
  }
};

export const deleteProfileImage = async () => {
  try {
    const response = await api.delete('/api/user/profile-image');
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Image delete error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to delete image',
    };
  }
};



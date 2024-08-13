const cloudinary = require('../utils/cloudinaryConfiguration');

const uploadFile = (file, fileType, folder) => {
  return new Promise((resolve, reject) => {
    // Check file type
    if (fileType !== 'image' && fileType !== 'video') {
      return reject(new Error('Invalid file type. Must be "image" or "video".'));
    }

    // Convert ArrayBuffer to Buffer
    const buffer = Buffer.from(file);

    // Upload file to Cloudinary
    cloudinary.uploader.upload_stream(
      {
        resource_type: fileType === 'image' ? 'image' : 'video',
        folder: `Samandari/${folder}`, // Folder in Cloudinary
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    ).end(buffer);
  });
};

const deleteFile = (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, { invalidate: true }, (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });
  });
};

module.exports = { uploadFile, deleteFile };




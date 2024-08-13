const cloudinary = require("../utils/cloudinaryConfiguration");

async function uploadFile(fileBuffer, folder, fileName) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'auto', // auto-detects the type of the file
        public_id: fileName,
      },
      (error, result) => {
        if (error) {
          reject(new Error('Failed to upload file'));
        } else {
          resolve(result.secure_url); // Return the secure URL of the uploaded file
        }
      }
    );

    stream.end(fileBuffer);
  });
}

module.exports = uploadFile;
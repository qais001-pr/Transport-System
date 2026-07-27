const { uploadToCloudinary } = require("../middlewares/cloudinary");

const uploadFile = async (file, folder) => {
    if (!file) return null;

    const result = await uploadToCloudinary(
        file.path,
        folder
    );

    return {
        url: result.secure_url,
        publicId: result.public_id,
    };
};

module.exports = { uploadFile };
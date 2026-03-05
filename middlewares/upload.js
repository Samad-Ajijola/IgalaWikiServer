const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary"); // configure your cloudinary instance

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "IgalaEventsFolder",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      { width: 1200, crop: "limit" },
      { quality: "auto" },
      { fetch_format: "auto" },
    ],
  }),
});

const upload = multer({ storage });

module.exports = upload;
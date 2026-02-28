const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary"); // your cloudinary config

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "IgalaEventsFolder",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

module.exports = upload;
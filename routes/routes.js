const router = require("express").Router();
const userCtrl = require("../controllers/userCtrl");
const eventCtrl = require("../controllers/eventCtrl");
const upload = require("../middlewares/upload"); // multer setup

router.post("/register", userCtrl.register);
router.post("/login", userCtrl.login);

router.post(
  "/event",
  upload.fields([     
    { name: "image", maxCount: 1 },
    { name: "galleryImages", maxCount: 5 },
  ]),
  eventCtrl.createEvent 
);

module.exports = router;


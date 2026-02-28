const router = require("express").Router();
const userCtrl = require("../controllers/userCtrl");
const eventCtrl = require("../controllers/eventCtrl");
const upload = require("../middlewares/upload");
const projectCtrl = require("../controllers/projectCtrl")
const statsCtrl = require("../controllers/statsCtrl")

router.post("/register", userCtrl.register);
router.post("/login", userCtrl.login);
//Events
router.get("/event", eventCtrl.getAll);
router.get("/event/:id", eventCtrl.getById)
router.put("/event/:id", eventCtrl.update);
router.delete("/event/:id", eventCtrl.delete);

router.post(
  "/event",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "galleryImages", maxCount: 5 },
  ]),
  eventCtrl.createEvent
);

//Project
router.get("/project", projectCtrl.getAll);
router.post("/project", projectCtrl.create)
router.put("/project/:id", projectCtrl.update);
router.delete("/project/:id", projectCtrl.delete);

// Stats
router.get("/stats", statsCtrl.get);
router.put("/stats", statsCtrl.update);

module.exports = router;


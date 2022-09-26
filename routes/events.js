const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const eventsController = require("../controllers/events");
const authMiddleware = require("../middleware/auth");

//Event Routes - simplified for now
router.get("/", authMiddleware.ensureAuth, eventsController.getEvents);
router.get("/createEvent", authMiddleware.ensureAuth, eventsController.getEventForm);
router.post("/createEvent", authMiddleware.ensureAuth, upload.single("file"), eventsController.createEvent);
router.delete("/deleteEvent/:id", authMiddleware.ensureAuth, eventsController.deleteEvent);
router.get("/:name", authMiddleware.ensureAuth, eventsController.getEvent);

module.exports = router;

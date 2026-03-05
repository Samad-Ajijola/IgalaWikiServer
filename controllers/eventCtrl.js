const Event = require("../models/event");
const mongoose = require("mongoose");

// Helper: Validate Mongo ObjectId
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id) && id.length === 24;
}

const eventCtrl = {
  // GET all events
  getAll: async (req, res) => {
    try {
      const page = Math.max(parseInt(req.query.page) || 1, 1);
      const limit = Math.min(parseInt(req.query.limit) || 10, 50);
      const skip = (page - 1) * limit;

      const [events, total] = await Promise.all([
        Event.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        Event.countDocuments(),
      ]);

      res.json({
        data: events,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (err) {
      console.error("Failed to fetch events:", err);
      res.status(500).json({ error: "Failed to fetch events" });
    }
  },

  // GET by ID
  getById: async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res.status(400).json({ error: "Invalid event id" });

    try {
      const event = await Event.findById(id).lean();
      if (!event) return res.status(404).json({ error: "Event not found" });
      res.json(event);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch event" });
    }
  },

  // CREATE event
  createEvent: async (req, res) => {
    try {
      const { name, description } = req.body;

      let imageSrc = "";
      let imageKey = "";
      let galleryImages = [];

      // Main Image
      if (req.files?.image?.length > 0) {
        imageSrc = req.files.image[0].path;
        imageKey = req.files.image[0].filename;
      }

      // Gallery Images
      if (req.files?.galleryImages?.length > 0) {
        galleryImages = req.files.galleryImages.map((file) => file.path);
      }

      const newEvent = await Event.create({
        name,
        description,
        imageSrc,
        imageKey,
        galleryImages,
      });

      res.status(201).json(newEvent);
    } catch (error) {
      console.error("Failed to create event:", error);
      res.status(500).json({ message: "Server Error" });
    }
  },

  // UPDATE event
  update: async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res.status(400).json({ error: "Invalid event id" });

    const updates = {};
    const { name, description } = req.body;

    if (name !== undefined) updates.name = name.trim();
    if (description !== undefined) updates.description = description.trim();

    if (req.files?.image?.[0]) {
      updates.imageSrc = req.files.image[0].path;
      updates.imageKey = req.files.image[0].filename;
    }

    if (req.files?.galleryImages) {
      updates.galleryImages = req.files.galleryImages.map((f) => f.path);
    }

    try {
      const updated = await Event.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true },
      );
      if (!updated) return res.status(404).json({ error: "Event not found" });
      res.json(updated);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update event" });
    }
  },

  // DELETE event
  delete: async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id))
      return res.status(400).json({ error: "Invalid event id" });

    try {
      const deleted = await Event.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ error: "Event not found" });
      res.status(204).send();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to delete event" });
    }
  },
};

module.exports = eventCtrl;

const Event = require("../models/event");
const mongoose = require("mongoose");

/* ----------------------------------------
   Helper: Validate Mongo ObjectId
----------------------------------------- */
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id) && id.length === 24;
}

const eventCtrl = {
  /* ----------------------------------------
     Get All Events (Paginated)
  ----------------------------------------- */
  getAll: async (req, res) => {
    try {
      const page = Math.max(parseInt(req.query.page) || 1, 1);
      const limit = Math.min(parseInt(req.query.limit) || 10, 50); // max 50
      const skip = (page - 1) * limit;

      const [events, total] = await Promise.all([
        Event.find()
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
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

  /* ----------------------------------------
     Get Single Event
  ----------------------------------------- */
  getById: async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid event id" });
    }

    try {
      const event = await Event.findById(id).lean();

      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      res.json(event);
    } catch (err) {
      console.error("Failed to fetch event:", err);
      res.status(500).json({ error: "Failed to fetch event" });
    }
  },

  /* ----------------------------------------
     Create Event
  ----------------------------------------- */
  createEvent: async (req, res) => {
    const { name, description, imageSrc, galleryImages } = req.body;

    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: "Name is required" });
    }

    try {
      const event = await Event.create({
        name: name.trim(),
        description: description?.trim() || "",
        imageSrc: imageSrc || "",
        galleryImages: Array.isArray(galleryImages)
          ? galleryImages
          : [],
      });

      res.status(201).json(event);
    } catch (err) {
      console.error("Failed to create event:", err);
      res.status(500).json({ error: "Failed to create event" });
    }
  },

  /* ----------------------------------------
     Update Event
  ----------------------------------------- */
  update: async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid event id" });
    }

    const updates = {};
    const { name, description, imageSrc, galleryImages } = req.body;

    if (name !== undefined) updates.name = name.trim();
    if (description !== undefined) updates.description = description.trim();
    if (imageSrc !== undefined) updates.imageSrc = imageSrc;
    if (galleryImages !== undefined) {
      updates.galleryImages = Array.isArray(galleryImages)
        ? galleryImages
        : [];
    }

    try {
      const updated = await Event.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
      );

      if (!updated) {
        return res.status(404).json({ error: "Event not found" });
      }

      res.json(updated);
    } catch (err) {
      console.error("Failed to update event:", err);
      res.status(500).json({ error: "Failed to update event" });
    }
  },

  /* ----------------------------------------
     Delete Event
  ----------------------------------------- */
  delete: async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid event id" });
    }

    try {
      const deleted = await Event.findByIdAndDelete(id);

      if (!deleted) {
        return res.status(404).json({ error: "Event not found" });
      }

      res.status(204).send();
    } catch (err) {
      console.error("Failed to delete event:", err);
      res.status(500).json({ error: "Failed to delete event" });
    }
  },
};

module.exports = eventCtrl;
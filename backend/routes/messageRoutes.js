const express = require("express");
const Message = require("../models/Message");

const router = express.Router();

// Send message
router.post("/", async (req, res) => {
  try {
    const { sender, receiver, content } = req.body;
    const message = await Message.create({ sender, receiver, content });
    res.json(message);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Get conversation
router.get("/:user1/:user2", async (req, res) => {
  try {
    const { user1, user2 } = req.params;
    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 }
      ]
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;

const express = require("express");
const app = express();
const sequelize = require("../utils/database");
const Sequelize = require("sequelize");
app.set("view engine", "ejs");
const router = express.Router();
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
const { user, contact, message } = require('../models')
app.use(bodyParser.urlencoded({ extended: true }));

exports.getmessage = async (req, res) => {
  // res.render('user');
  res.send("hello")
  console.log("hello");
}

exports.postmessage = async (req, res) => {
  try {
    const { receiver_id, content } = req.body;
    const sender_id = req.user.id;
    const userdata = await message.create({
      receiver_id:receiver_id,
      content:content,
    });

    res.json(userdata);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
}

exports.getallmessage = async(req,res)=>{
try {
  const users = await message.findAll();
      res.status(200).json(users);
} catch (error) {
  console.log(error);
}
}


exports.postupdatemessage = async(req,res)=>{
  try {
    const updated = await message.update(req.body, {
      where: { id: req.user.id }
    });
    if (updated) {
      const updatedUser = await message.findByPk(req.user.id);
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.log(error);
  }
  }


  exports.postdeletemessage =async(req,res)=>{
    try {
      const deleted = await message.destroy({
        where: { id: req.user.id }
      });
      if (deleted) {
        res.status(204).json();
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (error) {
      console.log(error);
    }
  }

exports.markMessageAsRead=async(req, res) =>{
    try {
      const { id } = req.body;
      const [updated] = await message.update({ is_read: 1 }, {
        where: { id: id }
      });
      if (updated) {
        const updatedMessage = await message.findByPk(id);
        res.status(200).json(updatedMessage);
      } else {
        res.status(404).json({ error: 'Message not found' });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }










  const express = require('express');
const router = express.Router();
const { Message, User } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');

// Get chat messages between two users
router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { sender_id: req.user.id, receiver_id: req.params.userId },
          { sender_id: req.params.userId, receiver_id: req.user.id }
        ]
      },
      order: [['createdAt', 'ASC']]
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching messages.' });
  }
});

// Send a chat message
router.post('/:userId', authMiddleware, async (req, res) => {
  try {
    const message = await Message.create({
      sender_id: req.user.id,
      receiver_id: req.params.userId,
      content: req.body.content
    });
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while sending the message.' });
  }
});

module.exports = router;





// routes/message.js or equivalent
const express = require('express');
const router = express.Router();
const { Message, Contact, User } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');

// Send a message
router.post('/send', authMiddleware, async (req, res) => {
  const { receiverId, content } = req.body;
  const senderId = req.user.id;

  try {
    // Check if this is the first message between these users
    const existingContact = await Contact.findOne({
      where: {
        user_id: senderId,
        contact_user_id: receiverId,
      }
    });

    // If not already in contacts, add them
    if (!existingContact) {
      await Contact.create({
        user_id: senderId,
        contact_user_id: receiverId,
      });
      await Contact.create({
        user_id: receiverId,
        contact_user_id: senderId,
      });
    }

    // Save the message
    const message = await Message.create({
      sender_id: senderId,
      receiver_id: receiverId,
      content,
    });

    res.json({ message });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'An error occurred while sending the message.' });
  }
});

module.exports = router;

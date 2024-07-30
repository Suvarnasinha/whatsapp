const { contact, message } = require('../models'); // Import your models
const { Op } = require("sequelize");

exports.sendMessage = async (req, res) => {
  const { receiverId, content } = req.body;
  const senderId = req.userid; // Assuming req.userid is set after authentication
  try {
    // Find or create contact
    const existingContact = await contact.findOne({
      where: { user_id: senderId, contact_user_id: receiverId }
    });
    if (!existingContact) {
      await contact.create({ user_id: senderId, contact_user_id: receiverId });
      await contact.create({ user_id: receiverId, contact_user_id: senderId });
    }

    // Create message
    const messageData = await message.create({
      sender_id: senderId,
      receiver_id: receiverId,
      content,
    });

    res.json(messageData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'An error occurred while sending the message.' });
  }
};

exports.getMessage = async (req, res) => {
  try {
    const messages = await message.findAll({
      where: {
        [Op.or]: [
          { sender_id: req.userid, receiver_id: req.params.userId },
          { sender_id: req.params.userId, receiver_id: req.userid }
        ]
      },
      order: [['createdAt', 'ASC']]
    });
    res.json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'An error occurred while fetching messages.' });
  }
};

const express = require("express");
const app = express();
const sequelize = require("../utils/database");
const jwt = require('jsonwebtoken');
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const { user } = require('../models');
app.use(bodyParser.urlencoded({ extended: true }));

exports.getuser = async (req, res) => {
  res.send("hello");
};

exports.postuser = async (req, res) => {
  try {
    const { username, phoneNumber, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await user.create({
      username,
      phoneNumber,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser.id }, 'your_secret_key', { expiresIn: '1h' });
    res.json({ token, user: newUser });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

exports.postlogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const loginverify = await user.findOne({ where: { email } });

    if (!loginverify) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const validPassword = await bcrypt.compare(password, loginverify.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: loginverify.id }, 'your_secret_key', { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    const contacts = await user.findAll();
    res.json({ token, user: loginverify, contacts, messages: [] });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await user.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Implement sending a reset link to the user's email
    // You can use nodemailer to send the email with a reset token

    res.json({ message: 'Password reset link sent' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    // Verify token and find user
    // const decoded = jwt.verify(token, 'your_secret_key');
    // const user = await user.findByPk(decoded.id);

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword }, { where: { id: decoded.id } });

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

// Other CRUD operations (getAllUsers, updateUser, deleteUser)

const express = require('express');
const router = express.Router();
const { User } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');

// Get all users (protected route)
router.get('/all', authMiddleware, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'phoneNumber', 'email'], // Adjust as needed
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching users.' });
  }
});

module.exports = router;


exports.postupdateuser = async (req, res) => {
  try {
    const updated = await user.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedUser = await user.findByPk(req.params.id);
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.postdelete = async (req, res) => {
  try {
    const deleted = await user.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.log(error);
  }
};

const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const newUser = new User({ username: req.body.username, password: hashedPassword });
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) { res.status(500).json(err); }
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(404).json("User not found");
    
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).json("Wrong password");
    
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.status(200).json({ token, user: { id: user._id, username: user.username } });
  } catch (err) { res.status(500).json(err); }
});

module.exports = router;
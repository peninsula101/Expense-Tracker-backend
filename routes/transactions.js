const router = require('express').Router();
const Transaction = require('../models/Transaction');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const verify = (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) return res.status(401).send('Access Denied');
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) { res.status(400).send('Invalid Token'); }
};

router.post('/', verify, async (req, res) => {
  const newTransaction = new Transaction({ ...req.body, userId: req.user._id });
  try {
    const savedTransaction = await newTransaction.save();
    res.status(200).json(savedTransaction);
  } catch (err) { res.status(500).json(err); }
});

router.get('/', verify, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category, startDate, endDate } = req.query;
    const query = { userId: req.user._id };

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    if (category && category !== 'All') {
      query.category = category;
    }
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ date: -1 }); 

    const count = await Transaction.countDocuments(query);

    res.json({
      transactions,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) { res.status(500).json(err); }
});

router.put('/:id', verify, async (req, res) => {
  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true } 
    );
    res.status(200).json(updatedTransaction);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', verify, async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.status(200).json("Transaction deleted");
  } catch (err) { res.status(500).json(err); }
});

router.get('/summary', verify, async (req, res) => {
  try {
    const summary = await Transaction.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.user._id) } },
      {
        $group: {
          _id: "$category",
          totalAmount: { $sum: "$amount" }
        }
      }
    ]);
    res.json(summary);
  } catch (err) { res.status(500).json(err); }
});

module.exports = router;
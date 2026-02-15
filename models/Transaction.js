const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Food', 'Rent', 'Transport', 'Entertainment'] 
  },
  date: { type: Date, required: true },
  notes: { type: String } 
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);

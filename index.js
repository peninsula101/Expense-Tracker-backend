const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoute = require('./routes/auth');
const transactionRoute = require('./routes/transactions');

dotenv.config();
const app = express();

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connection Successful"))
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoute);
app.use('/api/transactions', transactionRoute);

app.listen(5000, () => { console.log("Backend server is running!"); });
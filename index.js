const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoute = require('./routes/auth');
const transactionRoute = require('./routes/transactions');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connection Successful"))
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoute);
app.use('/api/transactions', transactionRoute);

app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "auth-token"] // CRITICAL: Must allow 'auth-token'
}));

app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});

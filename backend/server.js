const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const donationRoutes = require('./routes/donations'); // 👈 Import routes correctly

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('API is working'));

app.use('/api/donate', donationRoutes); // 👈 Use the routes here

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

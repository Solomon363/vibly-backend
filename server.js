const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// --------------------
// Models
// --------------------
const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  tags: [String],
  url: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Video = mongoose.model("Video", videoSchema);

// --------------------
// Routes
// --------------------

// Search videos
app.get('/api/search', async (req, res) => {
  const query = req.query.q;

  try {
    const results = await Video.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } }
      ]
    });

    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: 'Search failed', details: err.message });
  }
});

// Optional: Placeholder for Auth routes
// const authRoute = require('./routes/auth');
// app.use('/api/auth', authRoute);

// --------------------
// Server Start
// --------------------
const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

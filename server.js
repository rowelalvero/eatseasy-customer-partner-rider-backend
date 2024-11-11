const express = require('express');
const cors = require('cors');
const axios = require('axios');
const compression = require('compression');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { fireBaseConnection } = require('./utils/fbConnect');

const port = 3000;

// Route imports
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const restRoute = require("./routes/restaurant");
const catRoute = require("./routes/category");
const foodRoute = require("./routes/food");
const cartRoute = require("./routes/cart");
const addressRoute = require("./routes/address");
const driverRoute = require("./routes/driver");
const messagingRoute = require("./routes/messaging");
const orderRoute = require("./routes/order");
const ratingRoute = require("./routes/rating");
const uploadRoute = require("./routes/uploads");

dotenv.config();
fireBaseConnection();

// MongoDB connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.log(err));

const app = express();

// CORS setup
const corsOptions = {
  origin: process.env.ALLOWED_ORIGIN || '*',
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// API endpoint to proxy the Google Places request
app.get('/api/autocomplete', async (req, res) => {
  const { input } = req.query;
  const googleApiKey = 'AIzaSyCBrZpYQFIWHQfgX4wvjzY5cC4JWDvu9XI'; // Add your Google API key here

  if (!input) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  try {
    // Make a request to the Google Places API
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
      params: {
        input,
        key: googleApiKey,
      },
    });

    // Forward the response from Google to the client
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch data from Google Places API' });
  }
});

// Compression setup
app.use(compression({ level: 6, threshold: 0 }));

// Parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes setup
app.use("/", authRoute);
app.use("/api/users", userRoute);
app.use("/api/restaurant", restRoute);
app.use("/api/category", catRoute);
app.use("/api/foods", foodRoute);
app.use("/api/cart", cartRoute);
app.use("/api/address", addressRoute);
app.use("/api/driver", driverRoute);
app.use("/api/orders", orderRoute);
app.use("/api/rating", ratingRoute);
app.use("/api/messaging", messagingRoute);
app.use("/api/uploads", uploadRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Server setup
const ip = "127.0.0.1";
const port = process.env.PORT || 8000;

app.listen(port, ip, () => {
  console.log(`Product server listening on ${ip}:${port}`);
});

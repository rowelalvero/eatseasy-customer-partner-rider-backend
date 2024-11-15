// Import necessary modules
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const axios = require('axios'); // For making HTTP requests
const { fireBaseConnection } = require('./utils/fbConnect');

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

// Define allowed origins
const allowedOrigins = [
  'https://eatseasy-partner.web.app',
  'https://eatseasyfoods.web.app',
  'https://partner.eatseasy.online',
  'https://foods.eatseasy.online'
];

// CORS setup
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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

// Google Directions Proxy Route
app.get("/api/directions", async (req, res) => {
  const { origin, destination } = req.query;
  const googleApiKey = process.env.GOOGLE_API_KEY; // Use an environment variable for your Google API key

  if (!origin || !destination) {
    return res.status(400).json({ error: "Origin and destination are required" });
  }

  try {
    // Construct the Google Directions API URL
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${googleApiKey}`;

    // Make the request to the Google Directions API
    const response = await axios.get(url);

    // Send the response data back to the client
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching directions:", error);
    res.status(500).json({ error: "Failed to fetch directions from Google API" });
  }
});

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

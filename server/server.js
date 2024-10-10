const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config({ path: "./config/.env" }); // Load environment variables

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware to parse JSON
app.use(express.json());

// Define routes
app.use("/api/products", require("./routes/productRoutes"));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const express = require("express");
const router = express.Router();
const {
  initDatabase,
  getAllTransactions,
  getStatistics,
  getBarChartData,
} = require("../controllers/productController");

// Route to initialize the database with seed data
router.get("/init", initDatabase);

// Route to get all transactions with optional search and pagination
router.get("/", getAllTransactions);

// Route to get statistics
router.get("/statistics", getStatistics);

// Route to get bar chart data
router.get("/barchart", getBarChartData); // New route for bar chart data

module.exports = router;

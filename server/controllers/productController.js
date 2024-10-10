const fetchData = require("../services/fetchData");
const Product = require("../models/product");

// Controller to initialize the database with seed data
const initDatabase = async (req, res) => {
  try {
    await fetchData(); // Call the function that fetches and stores the data
    res.status(200).json({ message: "Database initialized successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to initialize database" });
  }
};

// Controller to get all transactions with optional search and pagination
const getAllTransactions = async (req, res) => {
  const { page = 1, perPage = 10, search = "" } = req.query;

  console.log(
    `Fetching transactions: page=${page}, perPage=${perPage}, search=${search}`
  ); // Log input values

  try {
    const query = {};

    if (search) {
      const parsedPrice = parseFloat(search);
      const isPriceSearch = !isNaN(parsedPrice) && search.trim() !== "";

      if (isPriceSearch) {
        query.price = { $gte: parsedPrice - 0.01, $lte: parsedPrice + 0.01 }; // Match against price with a small range
      } else {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }
    }

    // Fetching transactions with pagination
    const transactions = await Product.find(query)
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage));

    // Count total number of matching records
    const totalCount = await Product.countDocuments(query);

    console.log(`Total transactions found: ${totalCount}`); // Log total transactions found

    res.status(200).json({
      total: totalCount,
      page: parseInt(page),
      perPage: parseInt(perPage),
      transactions,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error); // Log error details
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};

// Controller to get statistics
const getStatistics = async (req, res) => {
  try {
    const totalCount = await Product.countDocuments({});
    const totalRevenue = await Product.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$price" } } },
    ]);
    const averagePrice = await Product.aggregate([
      { $group: { _id: null, averagePrice: { $avg: "$price" } } },
    ]);
    const soldCount = await Product.countDocuments({ sold: true });
    const unsoldCount = await Product.countDocuments({ sold: false });

    // Breakdown by category
    const categoryBreakdown = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      totalCount,
      totalRevenue: totalRevenue[0]?.totalRevenue || 0,
      averagePrice: averagePrice[0]?.averagePrice || 0,
      soldCount,
      unsoldCount,
      categoryBreakdown,
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
};

// Controller to get bar chart data
const getBarChartData = async (req, res) => {
  try {
    const categoryData = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          total: { $sum: 1 },
          revenue: { $sum: "$price" },
        },
      },
      { $project: { category: "$_id", total: 1, revenue: 1 } },
    ]);

    res.status(200).json(categoryData);
  } catch (error) {
    console.error("Error fetching bar chart data:", error);
    res.status(500).json({ error: "Failed to fetch bar chart data" });
  }
};

module.exports = {
  initDatabase,
  getAllTransactions,
  getStatistics,
  getBarChartData, // Exporting the new function
};

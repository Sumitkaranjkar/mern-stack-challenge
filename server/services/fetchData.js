const axios = require("axios");
const Product = require("../models/product");

const fetchData = async () => {
  try {
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    const products = response.data; // Assuming the API returns an array of products

    // Clear the existing products in the database (optional)
    await Product.deleteMany({});

    // Insert new products into the database
    await Product.insertMany(products);
    console.log("Data inserted successfully");
  } catch (error) {
    console.error("Error fetching or inserting data:", error);
  }
};

module.exports = fetchData;

const mongoose = require("mongoose");

const connectDB = async () => {
  //   console.log("MongoDB URI:", process.env.MONGO_URI); // Log the URI to verify
  try {
    await mongoose.connect(
      "mongodb+srv://sumitkaranjkar741:Lip43IgJvgcTXXyA@first.3whwl.mongodb.net/myDatabase?retryWrites=true&w=majority"
      //   process.env.MONGO_URI
    ); // Removed deprecated options
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection failed", err);
    process.exit(1);
  }
};

module.exports = connectDB;

// "mongodb+srv://sumitkaranjkar741:Lip43IgJvgcTXXyA@first.3whwl.mongodb.net/myDatabase?retryWrites=true&w=majority"

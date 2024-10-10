const fetchData = require("../services/fetchData");
const seedDatabase = async () => {
  await fetchData();
  console.log("Database seeded");
};
seedDatabase();

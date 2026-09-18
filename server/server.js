require("dotenv").config();

const app = require("./app");
const initializeDatabase = require("./config/initDb");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`Signal server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start Signal server:", error);
    process.exit(1);
  }
};

startServer();
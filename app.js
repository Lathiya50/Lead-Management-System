const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const errorHandler = require("./middleware/errorHandler");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());
// Mount routers
app.use("/api/v1/leads", require("./routes/leadRoutes"));
app.use("/api/v1/contacts", require("./routes/contactRoutes"));
app.use("/api/v1/interactions", require("./routes/interactionRoutes"));
app.use("/api/v1/orders", require("./routes/orderRoutes"));
app.use("/api/v1/kams", require("./routes/kamRoutes"));

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in on port ${PORT}`);
});

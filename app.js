const cluster = require("cluster");
const os = require("os");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const compression = require("compression");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/database");
const errorHandler = require("./middleware/errorHandler");

dotenv.config();

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;
  console.log(`Master process ${process.pid} is running`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(
      `Worker ${worker.process.pid} exited with code ${code}, signal ${signal}. Spawning a new one.`
    );
    cluster.fork();
  });
} else {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(compression()); // Enable Gzip compression
  app.use(helmet()); // Secure HTTP headers
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: "Too many requests from this IP, please try again later.",
    })
  );
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || "*", // Allow specific origins in production
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  // Connect to Database
  connectDB();

  // Routes
  app.use("/api/v1/leads", require("./routes/leadRoutes"));
  app.use("/api/v1/contacts", require("./routes/contactRoutes"));
  app.use("/api/v1/interactions", require("./routes/interactionRoutes"));
  app.use("/api/v1/orders", require("./routes/orderRoutes"));
  app.use("/api/v1/kams", require("./routes/kamRoutes"));

  app.get("/", (req, res) => res.send("API is running..."));

  // Error Handler
  app.use(errorHandler);

  // Server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Worker ${process.pid} running on port ${PORT}`);
  });

  // Graceful Shutdown
  process.on("SIGTERM", () => {
    console.log(`Worker ${process.pid} shutting down gracefully.`);
    process.exit();
  });

  process.on("SIGINT", () => {
    console.log(`Worker ${process.pid} interrupted.`);
    process.exit();
  });
}

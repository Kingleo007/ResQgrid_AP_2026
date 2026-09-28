const express = require("express");
const env = require("./config/env");
const healthRoutes = require("./routes/health.routes");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "ResQGrid API is running",
  });
});

app.use("/api/health/db", healthRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

app.listen(env.port, () => {
  console.log(`ResQGrid backend running on port http://localhost:${env.port}`);
});
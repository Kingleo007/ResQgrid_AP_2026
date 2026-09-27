require("dotenv").config();

const express = require("express");

const app = express();

const PORT = process.env.PORT || 5000;


app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "ResQGrid API is running"
  });
});

app.listen(PORT, () => {
  console.log(`ResQGrid backend running on http://localhost:${PORT}`);
});
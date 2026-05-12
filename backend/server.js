const express = require("express");
const cors = require("cors");
require("dotenv").config();

const marketPriceRoutes = require("./routes/marketPriceRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("RythuLink AI Node Backend running");
});

app.use("/api/market-prices", marketPriceRoutes);

const PORT = 8085;

app.listen(PORT, () => {
  console.log(`Node backend running on port ${PORT}`);
});
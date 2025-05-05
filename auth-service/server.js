const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

app.use("/auth", require("./routes/authRoutes"));

app.listen(5000, () => console.log("Auth Service running on port 5000"));

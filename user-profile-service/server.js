const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI);

app.use("/", require("./routes/profileRoutes"));

app.listen(5001, () => console.log("UserProfile Service running on port 5001"));

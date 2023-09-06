const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require('./config/db');
const userRoutes = require("./routes/userRoutes");
const app = express();

dotenv.config();
connectDB();
app.use(cors());
app.use(express.json());

app.use('/api/user', userRoutes);

const PORT = 8000 || process.env.PORT;

app.listen(PORT, () => {
    console.log("Server is running");
})
const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });
        console.log("mongo db connected");
    } catch (error) {
        console.log("error", error.message);
        process.exit();
    }
}

module.exports = connectDB;
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    //Done connection using .env
    const conn = await mongoose.connect(process.env.MONGOURL);
    //just for cyan highlighted text
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;

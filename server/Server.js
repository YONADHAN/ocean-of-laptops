const express = require("express");
const app = express();
const cors = require("cors");
const env = require("dotenv").config();
const userRoute = require("./router/userRoute");
const adminRoute = require("./router/adminRoute");
const connectDB = require("./config/db");
const authRoute = require('./router/authRoute');
const publicRoute = require('./router/publicRoute')
// Connect to the database
connectDB();

app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from your React frontend
    credentials: true, // Allow cookies and headers like Authorization
  })
);

const cookieParser = require('cookie-parser');
app.use(cookieParser());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up routes

app.use("/", userRoute);
app.use("/admin", adminRoute);
app.use("/auth",authRoute);
app.use("/public",publicRoute);

app.listen(3000, () => {
  console.log("Server started on port number 3000");
});

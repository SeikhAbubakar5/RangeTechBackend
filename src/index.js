require('dotenv').config({ path: 'src/.env' });
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
const AuthRoutes = require('./routes/authroutes');

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/linkedin', AuthRoutes);

mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 7001;
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});

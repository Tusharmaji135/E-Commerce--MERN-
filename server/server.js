require("@dotenvx/dotenvx").config();
const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const AuthRouter = require('./routes/auth/auth.routes.js')

// db connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/mydatabase")
  .then(() => console.log("Succesfully connected with Database"))
  .catch((err) => console.log(err));

const app = express();
const port = process.env.PORT || 5000;

//CORS
app.use(
  cors({
    origin: `http://localhost:5173`,
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

//routes
app.use('/api/auth',AuthRouter)


app.listen(port, () =>
  console.log(`Server is now running on port : http://localhost:${port}`)
);

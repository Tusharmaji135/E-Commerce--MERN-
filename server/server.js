const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

//db connection
mongoose
  .connect(
    "mongodb+srv://135tusharmaji:135tusharmaji@cluster0.syhchtl.mongodb.net/"
  )
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

app.listen(port, () =>
  console.log(`Server is now running on port : http://localhost:${port}`)
);

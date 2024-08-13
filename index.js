const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Import routes
const authRoutes = require("./routes/authRoute");
const applicationRoutes = require("./routes/applicationRoute");
const chatRoute = require("./routes/chatRoute");
const postRoute = require("./routes/postRoute");
const messages = require("./routes/messages");
const applyAuthRoute = require("./routes/ablyRoute");
const awsRoutes = require('./routes/awsRoutes');
const classRoutes = require('./routes/classRoutes');
const novelRoutes = require('./routes/novelRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const courseRoute = require("./routes/courseRoutes");
const adminRoute = require("./routes/adminRoute");

const app = express();
const testing = false;

// Connect to MongoDB
mongoose.connect(testing ? process.env.DB_URL_TESTING : process.env.DB_URL)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(3001, () => console.log("Listening on port 3001"));
  })
  .catch((err) => console.log("The actual error: " + err));

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "https://samandari.spaceedafrica.org", "https://samandari.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
  sameSite: "Strict",
}));

app.use(cookieParser());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Hello there from RUNYONGA API today for samandari");
});

app.use("/api/user", authRoutes);   
app.use("/api/application", applicationRoutes);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messages);
app.use("/api/posts", postRoute);
app.use("/api/auth", applyAuthRoute);
app.use("/api/course", courseRoute);
app.use('/api/aws', awsRoutes);
app.use('/api/class', classRoutes);
app.use('/api/novel', novelRoutes);
app.use('/api/rating', ratingRoutes);
app.use("/api/admin", adminRoute);

module.exports = app;

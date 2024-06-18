// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const uploadRoute = require('./routes/uploadRoute');
const registerRoutes = require("./routes/registerRoutes");
const employeeRoute = require('./routes/employeeRoute');
const dataRoute = require('./routes/dataRoute');
const authRoute = require('./routes/authRoute');

const dotenv = require("dotenv");

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error(err));

// Routes
app.use('/api/upload', uploadRoute);
app.use("/api/auth", registerRoutes);
app.use('/api/employees', employeeRoute);
app.use('/api/data', dataRoute);
app.use('/api/auth', authRoute);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

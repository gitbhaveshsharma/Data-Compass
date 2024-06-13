// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const uploadRoute = require('./routes/uploadRoute');
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

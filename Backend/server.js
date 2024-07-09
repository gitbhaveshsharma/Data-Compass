// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const uploadRoute = require('./routes/uploadRoute');
const employeeRoute = require('./routes/employeeRoute');
const dataRoute = require('./routes/dataRoute');
const authRoutes = require('./routes/authRoute');
const auth = require('./middleware/auth');
const productRoutes = require('./routes/productRoutes');
const callAttemptRoutes = require('./routes/callAttemptRoutes');
const alarmRoutes = require('./routes/alarmRoutes');
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
// app.use("/api/auth", registerRoutes);
app.use('/api/employees', employeeRoute);
app.use('/api/data', dataRoute);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Use the callAttempt routes
app.use('/api/callAttempts', callAttemptRoutes);

// Use the alarm routes
app.use('/api/alarms', alarmRoutes);


// Protecting a route as an example
app.get('/api/protected', auth, (req, res) => {
    res.send({ message: 'This is a protected route', user: req.user });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

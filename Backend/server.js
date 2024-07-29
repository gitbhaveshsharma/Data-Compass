const dotenv = require("dotenv");
dotenv.config(); // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const uploadRoute = require('./routes/uploadRoute');
const employeeRoute = require('./routes/employeeRoute');
const dataRoute = require('./routes/dataRoute');
const historyRoutes = require("./routes/historyRoutes");
const authRoutes = require('./routes/authRoute');
const productRoutes = require('./routes/productRoutes');
const callAttemptRoutes = require('./routes/callAttemptRoutes');
const alarmRoutes = require('./routes/alarmRoutes');
const auth = require('./middleware/auth');



const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
// Secure CORS configuration to allow only trusted origins
const corsOptions = {
    origin: function (origin, callback) {
        if (process.env.ALLOWED_ORIGINS.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error(err));

// Auth route (excluded from auth middleware)
app.use('/api/auth', authRoutes);

// Apply auth middleware to all other routes
app.use(auth);

app.use('/api/upload', uploadRoute);
app.use('/api/employees', employeeRoute);
app.use('/api/data', dataRoute);
app.use('/api/products', productRoutes);
app.use('/api/callAttempts', callAttemptRoutes);
app.use('/api/alarms', alarmRoutes);
app.use("/api/history", historyRoutes);

// Protecting a route
app.get('/api/protected', (req, res) => {
    res.send({ message: 'This is a protected route', user: req.user });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

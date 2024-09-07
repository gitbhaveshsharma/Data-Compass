const dotenv = require("dotenv");
dotenv.config(); // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

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
const PORT = process.env.PORT;


const allowedOrigins = process.env.ALLOWED_ORIGINS;

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || origin === allowedOrigins) {
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
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });
        console.log("MongoDB connected");
    } catch (err) {
        console.error(err);
    }
}
connectDB();

// Public routes (excluded from auth middleware)
app.use('/api/auth', authRoutes);

// // // Serve static files from the "frontend/build" directory
// app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));

// Apply auth middleware to all other routes that require authentication
app.use('/api/upload', auth, uploadRoute);
app.use('/api/employees', auth, employeeRoute);
app.use('/api/data', auth, dataRoute);
app.use('/api/products', auth, productRoutes);
app.use('/api/callAttempts', auth, callAttemptRoutes);
app.use('/api/alarms', auth, alarmRoutes);
app.use('/api/history', auth, historyRoutes);

// Protecting a route as an example
app.get('/api/protected', auth, (req, res) => {
    res.send({ message: 'This is a protected route', user: req.user });
});

// // Handle all other routes and send back the index.html file for frontend routing
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
// });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
    

// backend/routes/uploadRoute.js
const express = require('express');
const { uploadExcel } = require('../controllers/uploadController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.post('/', upload.single('file'), uploadExcel);

module.exports = router;


// backend/controllers/uploadController.js
const XLSX = require('xlsx');
const moment = require('moment-timezone');
const Data = require('../models/Data');

const generateCustomerId = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'SZ'; // Starting with "SZ"
    for (let i = 0; i < 5; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

const uploadExcel = async (req, res) => {
    try {
        const file = req.file;
        const workbook = XLSX.readFile(file.path);
        const sheet_name_list = workbook.SheetNames;
        const xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

        let duplicateCount = 0;

        const dataEntries = xlData.map(entry => {
            const customerId = entry.CustomerId || generateCustomerId(); // Generate ID if not provided
            return {
                customerId,
                name: entry.Name,
                number: entry.Number,
                address: entry.Address || '',
                city: entry.City || '',
                state: entry.State || '',
                zip: entry.Zip || '',
                nearBy: entry.NearBy || '',
                area: entry.Area || '',
                altNumber: entry.AltNumber || '',
                status: 'unassigned',
                department: entry.Department,
                activeDate: Date.now(), // Set the current time as the active date
            };
        });

        for (const entry of dataEntries) {
            const existingData = await Data.findOne({ number: entry.number });

            if (existingData) {
                const activeDate = moment(existingData.activeDate);
                const now = moment();
                const daysDifference = now.diff(activeDate, 'days');

                if (daysDifference > 5) {
                    existingData.status = 'unassigned';
                    existingData.department = entry.department; // Optionally update other fields
                    existingData.activeDate = Date.now(); // Update the active date
                    await existingData.save();
                } else {
                    duplicateCount++;
                }
            } else {
                await Data.create(entry); // Create new entry if no duplicate is found
            }
        }

        res.status(200).json({
            message: 'File uploaded and data processed successfully.',
            duplicateCount,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error uploading file');
    }
};

module.exports = { uploadExcel };
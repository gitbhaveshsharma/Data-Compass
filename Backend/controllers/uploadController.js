// backend/controllers/uploadController.js
const XLSX = require('xlsx');
const Data = require('../models/Data');

const uploadExcel = async (req, res) => {
    try {
        const file = req.file;
        const workbook = XLSX.readFile(file.path);
        const sheet_name_list = workbook.SheetNames;
        const xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

        const dataEntries = xlData.map(entry => ({
            name: entry.Name,
            number: entry.Number,
            address: entry.Address || '',
            status: 'unassigned',
            department: entry.Department,
        }));

        await Data.insertMany(dataEntries);

        res.status(200).send('File uploaded and data inserted successfully');
    } catch (error) {
        res.status(500).send('Error uploading file');
    }
};

module.exports = { uploadExcel };
   
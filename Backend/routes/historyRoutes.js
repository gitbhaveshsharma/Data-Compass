// routes/historyRoutes.js
const express = require("express");
const router = express.Router();
const historyController = require("../controllers/historyController");

router.post("/login", historyController.recordLoginHistory);
// router.post("/assignment", historyController.recordAssignmentHistory);
router.get("/:employeeId", historyController.getHistory);
// router.get('/assignment/:customerId', historyController.getAssignmentHistoryByCustomerId); // New route


module.exports = router;

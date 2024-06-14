const express = require("express");
const router = express.Router();
const registerController = require("../controllers/registerController"); // Updated path

// Register route (POST)
router.post("/register", async (req, res) => {
    const { email, password, name, role, department } = req.body;

    const response = await registerController.register(
        email,
        password,
        name,
        role,
        department
    );

    if (response.error) {
        res.status(400).json(response); // Send bad request for errors
    } else {
        res.json(response); // Send success message on successful registration
    }
});

module.exports = router;

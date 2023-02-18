// Library imports
let express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

// Model imports
const ADMIN = require('../models/admin');

// Utilities import
const { generateToken } = require('../middleware/token');

// API for admin login
router.post("/admin/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await ADMIN.findOne({ username: username.trim()});
        if(!admin) return res.status(404).json({ errors: { message:'Invalid credentials' }});

        const passwordMatch = await bcrypt.compare(password, user.password);
        if(!passwordMatch) return res.status(400).json({ errors: { message:'Invalid credentials' }});

        const payload = {
            id: admin._id,
            userType: admin.user_type
        }

        const accessKey = generateToken("admin", payload);
        return res.status(200)
        .cookie("accessKey", accessKey, { expires: new Date(new Date().getTime() + 518400 * 1000)})
        .send('Cookies Registered');

    } catch (error) {
        return res.status(500).json({ errors: { message:'Internal server error' }})
    }
});







module.exports = router
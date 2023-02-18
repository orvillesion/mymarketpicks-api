// Library import
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

// Model import
const RIDERS = require('../models/riders');

// Utilities import
const { emailValidator, stringInputTrimmer, objectIDValidator } = require('../utils/validator');
const { extractID } = require("../middleware/token");

require('dotenv').config({ path: '../.env'});
const { generateToken } = require('../middleware/token');

// API for rider login
router.post("/rider/login", async (req ,res) => {
    // NOTE: Missing error checking and middleware
    const { email, password } = req.body;
    let validateEmail = emailValidator(stringInputTrimmer(email).toLowerCase());
    if (validateEmail) return res.status(400).json({ errors: { message: 'Please enter valid email address'}});

    const user = await RIDERS.findOne({ email: email.toLowerCase() });
    if(!user) return res.status(404).json({ errors: { message:'Invalid credentials' }});

    const passwordMatch = await bcrypt.compare(password, user.password);
    if(!passwordMatch) return res.status(400).json({ errors: { message:'Invalid credentials' }});

    try {
        const tokenPayload = {
            id: user._id,
            userType: user.user_type
        }
        const accessKey = generateToken("rider", tokenPayload);
        return res.status(200)
        .cookie("accessKey", accessKey, { expires: new Date(new Date().getTime() + 518400 * 1000)})
        .send('Cookies Registered');
    } catch (error) {
        return res.status(500).json({ errors: { message:'Internal server error' }})
    }
});

// API for rider registration
router.post("/rider/register", async (req, res) => {
    const { firstName, lastName, email, password, mobile } = req.body;
    let validateEmail = emailValidator(stringInputTrimmer(email).toLowerCase());
    if (validateEmail) return res.status(400).json({ errors: { message: 'Please enter valid email address'}});
    let hashedPassword = await bcrypt.hash(password, 12);

    try {
        let newUser = new RIDERS({
            first_name: firstName,
            last_name: lastName,
            email: email.toLowerCase(),
            password: hashedPassword,
            mobile,
            user_type: "rider",
            account_status: true,
            account_verified: false
        });
        await newUser.save().then(() => {
            return res.status(201).json({ success: { message:'rider registered' }});
        });
    } catch (error) {
        switch(error.code) {
            case 11000: 
                return res.status(400).json({ errors:{ message:'Email already taken.'}});
            default:  
                return res.sendStatus(500);
        }
    }
});

// API for rider update profile
router.patch("/rider/profile-update", async (req, res) => {

    const userUid = await extractID(req.cookies.accessKey);

    const { firstName, lastName, mobile, messengerName } = req.body;
    const user = await RIDERS.findById(userUid).select('-password -__v -createdAt -updatedAt');
    if(!user) return res.status(404).json({ errors:{ message:'user not found' }});

    try {
        
    } catch (error) {
        
    }
});

module.exports = router;
// LIBRARY IMPORT
let express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

// MODEL IMPORT
const RIDERS = require('../models/riders');

// UTILS IMPORT
const { extractID } = require('../middleware/token');
const { objectIDValidator } = require('../utils/validator');

//
router.get("/all-rider", async (req, res) => {
    try {
        const allRiders = await RIDERS.find();
        if(!allRiders)return res.status(404).json({ errors:{ message: 'no data found' }});
        return res.status(200).json(allRiders);
    } catch (error) {
        return res.sendStatus(500);
    }
});

// API for getting a specific rider profile
router.get("/get-rider-profile", async (req, res) => {

    try {
    const userUid = await extractID(req.cookies.accessKey);
    const idCheck = objectIDValidator(userUid);

    if (!idCheck) return res.status(400).json({ errors: { message:'invalid user ID' }});
    const rider = await RIDERS.findById(userUid).select('-password');

    if(!rider) return res.status(404).json({ errors:{ message:'user not found' }})
    return res.status(200).json(rider);

    } catch (error) {
        return res.sendStatus(500);
    }
});

module.exports = router;
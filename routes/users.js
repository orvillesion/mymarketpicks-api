// LIBRARY IMPORT
let express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

// MODEL IMPORT
const USERS = require('../models/users');

// UTILS IMPORT
const { extractID } = require('../middleware/token');
const { objectIDValidator } = require('../utils/validator');

router.get("/all-users", async (req, res) => {
    try {
        const users = await USERS.find();
        if(!users)return res.status(404).json({ errors:{ message: 'no data found' }})
        return res.status(200).json(users)
    } catch (error) {
        return res.sendStatus(500);
    }
});

router.get("/get-user-profile", async (req, res) => {
    // const idCheck: Boolean = objectIDValidator(req.userId)
    try {
        const userUid = await extractID(req.cookies.accessKey);
        const idCheck = objectIDValidator(userUid);

        if (!idCheck) return res.status(400).json({ errors: { message:'invalid user ID' }});
        const user = await USERS.findById(userUid).select('-password');
        
        if(!user) return res.status(404).json({ errors:{ message:'user not found' }})
        return res.status(200).json(user)
        
    } catch (error) {
        return res.sendStatus(500);
    }
});

router.post("/user-add-item-cart", async (req, res) => {

});

router.post("/user-remove-item-cart", async (req, res) => {

});

module.exports = router;
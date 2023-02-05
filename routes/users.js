// LIBRARY IMPORT
let express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

// MODEL IMPORT
const USERS = require('../models/users');
const { objectIDValidator } = require('../utils/validator');

router.get("/get-user-profile", async (req, res) => {
    // const idCheck: Boolean = objectIDValidator(req.userId)
    try {
        const user = await USERS.find()
    } catch (error) {
        return res.sendStatus(500)
    }
})

module.exports = router;
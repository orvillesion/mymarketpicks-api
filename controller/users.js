// Library imports
let express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

// Model imports
const USERS = require('../models/users');
const { emailValidator, stringInputTrimmer } = require('../utils/validator');

// Utilities imports
require('dotenv').config({ path: '../.env'});
const { generateAccessToken } = require('../middleware/token');

router.post("/users/login", async (req, res) => {
    const { email, password } = req.body;
    let validateEmail = emailValidator(stringInputTrimmer(email).toLowerCase());
    if (validateEmail) return res.status(400).json({ errors: { message: 'Please enter valid email address'}});

    const user = await USERS.findOne({ email: email.toLowerCase()});
    if(!user) return res.status(404).json({ errors: { message:'Invalid credentials' }});

    const passwordMatch = await bcrypt.compare(password, user.password);
    if(!passwordMatch) return res.status(400).json({ errors: { message:'Invalid credentials' }});
    
    try {
        const tokenPayload = {
            id: user._id,
            pwd: password
        }

        const accessKey = generateAccessToken(tokenPayload);

        return res.status(200).json({ key: { accessKey: accessKey }})

    } catch (error) {
        return res.status(500).json({ errors: { message:'Internal server error' }})
    }
});

// NOTE: Missing error checking and middleware
// User registration API
router.post("/users/registration", async (req, res) => {
    const { firstName, lastName, email, password, mobile, userType } = req.body;
    let validateEmail = emailValidator(stringInputTrimmer(email).toLowerCase());
    if (validateEmail) return res.status(400).json({ errors: { message: 'Please enter valid email address'}});
    let hashedPassword = await bcrypt.hash(password, 12);

    try {
        let newUser = new USERS({
            first_name: firstName,
            last_name: lastName,
            email: email.toLowerCase(),
            password: hashedPassword,
            mobile,
            user_type: userType
        });

        await newUser.save().then(() => {
            return res.status(201).json({ success:{ message:'user registered' }})
        })

    } catch (error) {
        console.log(error)
        switch(error.code) {
            case 11000: 
                return res.status(400).json({ errors:{ message:'Email already taken.'}})
            default:  
                return res.sendStatus(500)
        }
    }
});


module.exports = router;
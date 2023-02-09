// Library imports
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

// Model imports
const USERS = require('../models/users');
const { emailValidator, stringInputTrimmer, objectIDValidator } = require('../utils/validator');
const { extractID } = require("../middleware/token");

// Utilities imports
require('dotenv').config({ path: '../.env'});
const { generateAccessToken } = require('../middleware/token');

// API for user login
router.post("/users/login", async (req, res) => {
    // NOTE: Missing error checking
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
            userType: user.user_type
        }
        const accessKey = generateAccessToken(tokenPayload);
        return res.status(200)
        .cookie("accessKey", accessKey, { expires: new Date(new Date().getTime() + 518400 * 1000)})
        .send('Cookies Registered');

    } catch (error) {
        return res.status(500).json({ errors: { message:'Internal server error' }})
    }
});

// API for user registration
router.post("/users/registration", async (req, res) => {
    // NOTE: Missing error checking and middleware

    const { firstName, lastName, email, password, mobile } = req.body;
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
            user_type: "regular-user",
            account_status: true,
            account_verified: false
        });
        await newUser.save().then(() => {
            return res.status(201).json({ success: { message:'user registered' }});
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

// API for user deletion
router.post("/users/remove-user", async (req, res) => {

})

// <************************************************ START PROFILE AREA ************************************************>

// API for update user profile
router.patch("/users/profile-update", async (req, res) => {
    // NOTE: Missing error checking, token validator, and middleware
    const userUid = await extractID(req.cookies.accessKey);

    const { firstName, lastName, mobile, messengerName } = req.body;
    const user = await USERS.findById(userUid).select('-password -__v -createdAt -updatedAt');
    if(!user) return res.status(404).json({ errors:{ message:'user not found' }});

    try {
        const uid = user._id
        const userDetails = {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            mobile: mobile.trim(),
            messenger_name: messengerName.trim()
        }

        const update = await USERS.findByIdAndUpdate(
            uid,
            { $set: userDetails },
            { new: true }
        )
        if(update) return res.status(201).json({ success: { message:'profile updated' }})
        return res.status(400)
    } catch (error) {
        return res.sendStatus(500)
    }

});
// <************************************************ END PROFILE AREA ************************************************>


// <************************************************ START ADDRESS AREA ************************************************>

// API for adding user address
router.post("/users/profile-add-address", async (req, res) => {
    //NOTE: Missing token validator and error handling
    const userUid = await extractID(req.cookies.accessKey);

    const { barangay, municipality, landmark, priority } = req.body;
    const user = await USERS.findById(userUid).select('-password -__v -createdAt -updatedAt');
    if(!user) return res.status(404).json({ errors:{ message:'user not found' }});

    const uid = user._id;
    const addressData = {
        barangay,
        municipality,
        landmark,
        priority
    }
    
    try {
        const newAddress = await USERS.findByIdAndUpdate(
            uid,
            { $push: { "address": addressData }},
            { new: true }
        )
        if(newAddress) return res.status(201).json({ success: { message:'address added' }})
        return res.status(400)
    } catch (error) {
        return res.sendStatus(500)
    }
});

// API for editing existing address in a user
router.post("/users/profile-update-address/:addressId", async (req, res) => {
    //NOTE: Missing token validator and error handling

    const userUid = await extractID(req.cookies.accessKey);
    const { barangay, municipality, landmark, priority } = req.body;
    const addressId = req.params.addressId;

    const user = await USERS.findById(userUid).select('-password -__v -createdAt -updatedAt');
    if(!user) return res.status(404).json({ errors:{ message:'user not found' }});

    const uid = user._id;
    try {
        const updatedAddress = await USERS.findByIdAndUpdate(
            uid,
            {
                $set: {
                    "address.$[element].barangay": barangay,
                    "address.$[element].municipality": municipality,
                    "address.$[element].landmark": landmark,
                    "address.$[element].priority": priority
                }
            },
            {
                arrayFilters: [
                    {
                        "element._id": mongoose.Types.ObjectId(addressId)
                    }
                ]
            }
        )
        if(updatedAddress) return res.status(201).json({ success: { message:'address updated' }})
        return res.status(400)
    } catch (error) {
        console.log(error)
        return res.sendStatus(500)
    }
});

// API for removing existing address in a user
router.delete("/users/profile-remove-address/:addressId", async (req, res) => {
    // NOTE: Missing error checking and middleware
    const userUid = await extractID(req.cookies.accessKey);
    const addressId = req.params.addressId;

    const user = await USERS.findById(userUid).select('-password -__v -createdAt -updatedAt');
    if(!user) return res.status(404).json({ errors:{ message:'user not found' }});

    const uid = user._id;
    try {
        const removedAddress = await USERS.findByIdAndUpdate(
            uid,
            {
                $pull: {
                    address: { _id: mongoose.Types.ObjectId(addressId) }
                }
            }
        )
        if(removedAddress) return res.status(201).json({ success: { message:'address updated' }})
        return res.status(400)
    } catch (error) {
        return res.sendStatus(500)
    }
})

// <************************************************ END ADDRESS AREA ************************************************>


// <************************************************ START PASSWORD AREA ************************************************>

// API for changing password
router.patch("/users/change-password", async (req, res) => {
    //NOTE: Token Validator Needed and error handling
    const { oldPassword, newPassword, confirmNewPassword } = req.body;
    if(newPassword.trim() === "" || confirmNewPassword.trim() === "") return res.status(400).json({ errors:{ message: 'New password field must not be empty.' }});

    const userUid = await extractID(req.cookies.accessKey);

    const user = await USERS.findById(userUid);
    if(!user) return res.status(404).json({ errors:{ message:'user not found' }});

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if(!isMatch) return res.status(400).json({ errors:{ message:'password not match' }});

    const samePassword = await bcrypt.compare(newPassword, user.password)
    if(samePassword) return res.status(400).json({ errors: { message:'new password can\'t be the same password' }});

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    const password = await bcrypt.compare(confirmNewPassword, hashedPassword);
    if(!password) return res.status(400).json({ errors: { message:'password and confirm password not match' }});

    try {
        const updatedUser = await USERS.findOneAndUpdate({ _id: user._id }, { password: hashedPassword}, { new: true });
        if(updatedUser) return res.status(200).json({ success: { message:'change password success!'}});
        return res.status(400).json({ errors:{ message:'change password error!' }});
    } catch (error) {
        return res.sendStatus(500);
    }
});

// <************************************************ END PASSWORD AREA ************************************************>
module.exports = router;
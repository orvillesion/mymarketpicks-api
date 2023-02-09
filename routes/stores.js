// LIBRARY IMPORT
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// MODEL IMPORT
const STORES = require('../models/stores');
const { extractID } = require('../middleware/token');

// API for getting store information
router.get("/search-store", async (req, res) => {

});


// API for adding a store
router.post("/create-new-store", async (req, res) => {
    // NOTE: Missing error checking and middleware

    // const userUid = await extractID(req.cookies.accessKey);
    const { storeName, mobile, address, barangay, municipality, province, landmark } = req.body

    try {
        const newStore = new STORES({
            store_name: storeName,
            mobile,
            address,
            barangay,
            municipality,
            province,
            landmark
        });
        await newStore.save().then(() => {
            return res.status(201).json({ success: { message:'store added' }});
        })
    } catch (error) {
        return res.sendStatus(500);
    }
});

// API for updating the store information
router.post("/update-store/:storeId", async (req, res) => {
    // NOTE: Missing error checking and middleware

    // const userUid = await extractID(req.cookies.accessKey);
    const userUid = await extractID(req.cookies.accessKey);
    const storeId = req.params.storeId;

    const { storeName, mobile, address, barangay, municipality, province, landmark } = req.body
    const storeDetails = {
        store_name: storeName,
            mobile,
            address,
            barangay,
            municipality,
            province,
            landmark
    }

    try {
        const update = await STORES.findByIdAndUpdate(
            storeId,
            { $set: storeDetails },
            { new: true }
        )
        if(update) return res.status(201).json({ success: { message:'store details updated' }})
        return res.status(400)
    } catch (error) {
        return res.sendStatus(500);
    }
});

router.delete("/remove-store/:storeId", async (req, res) => {
    // NOTE: Missing error checking and middleware and restrictions
    const storeId = req.params.storeId;
    const userUid = await extractID(req.cookies.accessKey);

    try {
        const remove = await STORES.findByIdAndRemove(storeId)
        if(remove) return res.status(201).json({ success: { message:'store removed' }})
        return res.status(400)
    } catch (error) {
        return res.sendStatus(500);
    }
});

module.exports = router;
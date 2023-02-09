// LIBRARY IMPORT
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// MODEL IMPORT
const STORE = require('../models/stores');
const { extractID } = require('../middleware/token');


// API for getting items based on category
router.get("/categorized-items", (req, res) => {

});

// API for adding item in a store
router.post("/add-item/:storeId", async (req, res) => {
    // NOTE: Missing error checking and middleware

    const storeId = req.params.storeId;
    const {  
        itemName,
        category,
        price,
        quantity,
        unit,
        description
    } = req.body

    const itemData = {  
        item_name: itemName,
        category,
        price,
        quantity,
        unit,
        description
    }

    try {
        const newItem = await STORE.findByIdAndUpdate(
            storeId,
            { $push: { "items": itemData }},
            { new: true }
        )
        if(newItem) return res.status(201).json({ success: { message:'item added' }})
        return res.status(400)
    } catch (error) {
        console.log(error)
        return res.sendStatus(500);
    }
});

// API for editing item in a store
router.post("/edit-item/:storeId/:itemId", async (req, res) => {
    // NOTE: Missing error checking and middleware

    const storeId = req.params.storeId;
    const itemId = req.params.itemId;
    const { 
        itemName,
        category,
        price,
        quantity,
        unit,
        description
    } = req.body

    try {
        const item = await STORE.findByIdAndUpdate(
            storeId,
            {
                $set: {
                    "items.$[element].item_name": itemName,
                    "items.$[element].category": category,
                    "items.$[element].price": price,
                    "items.$[element].quantity": quantity,
                    "items.$[element].unit": unit,
                    "items.$[element].description": description
                }
            },
            {
                arrayFilters: [
                    {
                        "element._id": mongoose.Types.ObjectId(itemId)
                    }
                ]
            }
        )
        if(item) return res.status(201).json({ success: { message:'item updated' }})
        return res.status(400)
    } catch (error) {
        return res.sendStatus(500);
    }
});

// API for deleting item in a store
router.delete("/remove-item/:storeId/:itemId", async (req, res) => {
    // NOTE: Missing error checking and middleware

    const storeId = req.params.storeId;
    const itemId = req.params.itemId;

    try {
        const removeItem = await STORE.findByIdAndUpdate(
            storeId,
            {
                $pull: {
                    items: { _id: mongoose.Types.ObjectId(itemId) }
                }
            }
        )
        if(removeItem) return res.status(201).json({ success: { message:'item removed' }});
        return res.status(400);
    } catch (error) {
        return res.sendStatus(500);
    }
});

module.exports = router
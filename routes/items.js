// LIBRARY IMPORT
let express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

// MODEL IMPORT
const STORE = require('../models/stores');
const { extractID } = require('../middleware/token');



module.exports = router
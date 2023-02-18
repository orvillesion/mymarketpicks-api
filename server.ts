// Library imports
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const http = require('http');

// Utilities imports
require('dotenv').config();
const { connectMongoDB } = require('./config/database');

// Express server initialization
const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

// Environmental variables
let whitelistIp: any = process.env.WHITELIST;

// Cors configuration 
const whitelist = whitelistIp.split(' ');
app.use(cors({
    credentials: true,
    origin: function (origin: any, callback: any) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
}));


// Routes and APIs
const usersRouter: Object = require('./routes/users');
const itemsRouter: Object = require('./routes/items');
const ordersRouter: Object = require('./routes/orders');
const storesRouter: Object = require('./routes/stores');

const userControllerRouter: Object = require('./controller/users');
const sellerControllerRouter: Object = require('./controller/sellers');
const riderControllerRouter: Object = require('./controller/riders');

app.use('/controller', userControllerRouter);
//app.use('/controller', sellerControllerRouter);
app.use('/controller', riderControllerRouter);

app.use('/users', usersRouter);
app.use('/stores', storesRouter);
app.use('/items', itemsRouter);
// app.use('/orders', ordersRouter);

// Database and server initialization
const port = process.env.PORT || 5000
app.set('trust proxy', 1)
const httpServer = http.createServer(app)
connectMongoDB().then(() => {
        httpServer.listen(port, '0.0.0.0', () => {
            console.log("✈  Database connected!")
            console.log(`🚀 server is running on port: ${port}!`)
        })
    })
    .catch(() => {
        console.log('⁉  Failed to connect!')
    })
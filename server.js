// Library imports
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var compression = require('compression');
var cookieParser = require('cookie-parser');
var http = require('http');
// Utilities imports
require('dotenv').config();
var connectMongoDB = require('./config/database').connectMongoDB;
// Express server initialization
var app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Environmental variables
var whitelistIp = process.env.WHITELIST;
// Cors configuration 
var whitelist = whitelistIp.split(' ');
app.use(cors({
    credentials: true,
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));
// Routes and APIs
var usersRouter = require('./routes/users');
var itemsRouter = require('./routes/items');
var ordersRouter = require('./routes/orders');
var storesRouter = require('./routes/stores');
var riderRouter = require('./routes/riders');
var userControllerRouter = require('./controller/users');
var sellerControllerRouter = require('./controller/sellers');
var riderControllerRouter = require('./controller/riders');
app.use('/controller', userControllerRouter);
//app.use('/controller', sellerControllerRouter);
app.use('/controller', riderControllerRouter);
app.use('/users', usersRouter);
app.use('/stores', storesRouter);
app.use('/items', itemsRouter);
app.use('/riders', riderRouter);
// app.use('/orders', ordersRouter);
// Database and server initialization
var port = process.env.PORT || 5000;
app.set('trust proxy', 1);
var httpServer = http.createServer(app);
connectMongoDB().then(function () {
    httpServer.listen(port, '0.0.0.0', function () {
        console.log("✈  Database connected!");
        console.log("\uD83D\uDE80 server is running on port: ".concat(port, "!"));
    });
})["catch"](function () {
    console.log('⁉  Failed to connect!');
});

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
require('dotenv').config({ path: '../.env'});

module.exports.connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            //useNewUrlParser: true,
            //useUnifiedTopology: true,
            //useFindAndModify: false,
            //useCreateIndex: true
        })
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}
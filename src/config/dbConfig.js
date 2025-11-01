const mongoose = require('mongoose');
const serverConfig = require('./serverConfig');

async function connectDB(){
    try{
        await mongoose.connect(serverConfig.DB_URL);
        console.log("Successfully connected to MongoDB Server ...");
    }
    catch (e){
        console.log("Unable to connect to MongoDB server ...");
        console.log(e);
    }
}

module.exports = { connectDB };
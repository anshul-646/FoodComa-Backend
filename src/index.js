const express = require('express');
const serverConfig = require('./config/serverConfig');

app = express();

app.listen(serverConfig.PORT,()=>{
    console.log(`Server started at port ${serverConfig.PORT} ...`);
});
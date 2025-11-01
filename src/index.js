const express = require('express');
// const bodyParser = require('body-parser');
const serverConfig = require('./config/serverConfig');
const { connectDB } = require('./config/dbConfig');


app = express();

app.use(express.json);
app.use(express.text);
app.use(express.urlencoded({extended : true}));

app.post('/',(req,res)=>{
    console/log(req.body);
    return res.json({
        message : "testing"
    })
})

app.listen(serverConfig.PORT,async ()=>{
    await connectDB();
    console.log(`Server started at port ${serverConfig.PORT} ...`);
});
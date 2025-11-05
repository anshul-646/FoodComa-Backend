const {loginUser} = require('../service/authService');

async function login(req,res){
    
    try{
        const loginPayload = req.body;

        const response = await loginUser(loginPayload);

        res.cookie("authToken",response,{
            httpOnly : true,
            secure : false,
            maxAge : 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "logged in successfully",
            success : true,
            data : {},
            error : {}
        });
    }
    catch(error){
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({
        message: error.message || "Internal Server Error",
        success: false,
        data: {},
        error
        });
    }
}

module.exports = {login};
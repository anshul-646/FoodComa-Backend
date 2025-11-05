const jwt = require('jsonwebtoken');
const { success } = require('zod');
const { JWT_SECRET } = require('../config/serverConfig');
const UnAuthorisedError = require('../utils/unauthorisedError');

async function isLoggedIn(req,res,next){
    const token = req.cookies["authToken"];
    if(!token){
        return res.status(401).json({
            success : false,
            data : {},
            error : "Not authenticated",
            message : "No Auth Token provided"
        });
    }

    try {
        const decoded = jwt.verify(token,JWT_SECRET);

        if(!decoded){
            throw new UnAuthorisedError;
        }
        // If reached here,then user is authenticated allow them to access api
        req.user = {
            email : decoded.email,
            id : decoded.id,
            role : decoded.role
        }

    } catch (error) {
        return res.status(401).json({
            success : false,
            data : {},
            error : "Not authenticated",
            message : "Invalid Token provided"
        });
    }
    next();
}

async function isAdmin(req,res,next){
    const isLoggedIn = req.user;

    if(isLoggedIn.role == "ADMIN"){
        next();
    }
    else{
        return res.status(401).json({
            success : false,
            data : {},
            message : "You are not authorised user for this action",
            error : {
                statusCode : 401,
                reason : "Unauthorised user for this action"
            }
        });
    }
}

module.exports = {
    isLoggedIn,
    isAdmin
};
// Client -> middleware -> controller
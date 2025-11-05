const {findUser} = require('../repositories/userRepository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {JWT_SECRET,JWT_EXPIRY} = require('../config/serverConfig');

async function loginUser(authDetails){
    const email = authDetails.email;
    const plainPassword = authDetails.password;

    // 1. Check if there is a registered user with the given email
    const user = await findUser({email});

    if(!user){
        throw {message:"No user found with given email",statusCode:404};
    }

    // 2. If user is found we need to compare plainIncomingPassword with hashed password
    const isPasswordValid = await bcrypt.compare(plainPassword,user.password);

    if(!isPasswordValid){
        throw {message:"Invalid password, plaese try again ", statusCode : 401};
    }

    // If password is validated ,create a token and return it
    const userRole = user.role || "USER";

    const token = jwt.sign({email:user.email,id:user._id,role : userRole},JWT_SECRET,{expiresIn:JWT_EXPIRY});

    return token;
}

module.exports = {loginUser};
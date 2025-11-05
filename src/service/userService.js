const {createUser,findUser} = require('../repositories/userRepository');
const {createCart} = require('../repositories/cartRepository');

async function registerUser(userDetails){
        // It will create a brand new user entry in db

        // 1. First we need to check if user with same email and mobile number exists already
        const user = await findUser({
            mobileNumber : userDetails.mobileNumber,
            email : userDetails.email
        });
        if(user){
            // we found an user
            throw {reason:'User with given email and mobile numbe already exists',statusCode:400};
        }
        // 2. If not then create the user in database
        const newUser = await createUser({
            email : userDetails.email,
            mobileNumber : userDetails.mobileNumber,
            firstName : userDetails.firstName,
            lastName : userDetails.lastName,
            password : userDetails.password
        });

        if(!newUser){
            throw {reason:'Something went wrong, try again later',statusCode : 500};
        }

        await createCart(newUser._id);
        // 3. return details of created user

        return newUser;
    }

module.exports = {registerUser};
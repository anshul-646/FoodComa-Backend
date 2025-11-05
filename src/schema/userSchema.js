const mongoose = require('mongoose');
const { required, minLength, lowercase, maxLength, trim } = require('zod/mini');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : [true, "First name is required"],
        minLength : [3,"First  name must be atleast 3 character long"],
        lowercase : true,
        trim : true,
        maxLength : [20, "First name should be less than 20 char long"]
    },
    lastName : {
        type : String,
        required : [true, "First name is required"],
        minLength : [3,"First  name must be atleast 3 character long"],
        lowercase : true,
        trim : true,
        maxLength : [20, "First name should be less than 20 char long"]
    },
    mobileNumber : {
        type : String,
        trim : true,
        unique : [true,"Phone number is already in use"],
        require : [true, "Phone number must be provided"],
        maxLength : [10,"Phone number should be of length 10"],
        minLength : [10,"Phone number should be of length 10"]
    },
    email : {
        type : String,
        trim : true,
        required : [true,"Email should be provided"],
        unique : [true,"Email is already in use"],
        match : [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password : {
        type : String,
        required : [true,"Password must be provided"],
        minLength : [6,"Password must be of 6 characters long."]
    },
    role : {
        type : String,
        enum : ['USER','ADMIN'],
        default : 'USER'
    }
},
{
    timestamps : true
});

userSchema.pre('save',async function(){
    // here you can mpdify your user before it is saved in mogodb.
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
});

const User = mongoose.model("User",userSchema);  // collection

module.exports = User;
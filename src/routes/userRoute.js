// Resource - user
// /users

const express = require('express');
const { createUser } = require('../controllers/userController');

// We have to initialise a router object to add route in a new file
// Routes are used for segregating your routes in different modules
const userRouter = express.Router();

userRouter.post('/',createUser);  // this is a route registration

module.exports = userRouter;    
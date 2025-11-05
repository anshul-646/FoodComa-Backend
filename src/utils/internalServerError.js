const { property } = require('zod');
const AppError = require('./appError');

class InternalServerError extends AppError{
    constructor(){
        super(`Something went wrong, try again later.`,500);
    }
}

module.exports = InternalServerError;
const { property } = require('zod');
const AppError = require('./appError');

class NotFoundError extends AppError{
    constructor(resource){
        super(`Not able to find properties  ${resource}`);
    }
}

module.exports = NotFoundError;
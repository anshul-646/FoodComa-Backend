const AppError = require('./appError');

class BadRequestError extends AppError {
  constructor(invalidParams) {
    let message = 'The request has the following invalid parameters:\n';

    if (Array.isArray(invalidParams)) {
      // If it's an array of validation messages
      invalidParams.forEach(param => {
        message += `- ${param}\n`;
      });
    } else if (typeof invalidParams === 'string') {
      // If it's a single message
      message += `- ${invalidParams}`;
    } else {
      // Unknown structure
      message += '- Unknown validation error';
    }

    super(message.trim(), 400);
  }
}

module.exports = BadRequestError;

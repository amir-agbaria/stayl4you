const utilService = require('./utilsService');

module.exports = {
    createIncorrectErrors
}

// Create error message
function createIncorrectErrors() {
    const errors = [];

    let error = utilService
        .createValidationError('email', 'כתובת מייל או סיסמא שוגיים נא לבדוק ולהזין שנית');
    errors.push(error);

    error = utilService.createValidationError('password');
    errors.push(error);

    return errors;
}

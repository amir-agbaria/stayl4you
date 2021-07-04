module.exports = {
    createValidationError
}

function createValidationError(param, msg = null, val = null,) {
    return { msg, param, val };
}

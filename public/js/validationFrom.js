function formVerification(errors) {
    if (errors !== null) {
        if (errors.length > 0) {
            $('.needs-validation input, .needs-validation select').each((index, input) => {
                // Reset the validation
                $(input).removeClass('is-invalid', 'is-valid');

                let nameCalss = isParamExist(input.name) ? 'is-invalid' : 'is-valid';
                $(input).addClass(nameCalss);
            });
        } else {
            $('.needs-validation').addClass('was-validated');
        }
    }
}

function isParamExist(paramName) {
    return errors.some((error) => {
        return error.param == paramName
    });
}

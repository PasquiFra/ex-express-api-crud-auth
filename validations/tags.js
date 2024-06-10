const tagData = {
    name: {
        in: ['body'],
        isString: {
            errorMessage: "Il campo name dev\'essere una stringa",
            bail: true
        },
        notEmpty: {
            errorMessage: "Il nome non può essere vuoto",
            bail: true
        }
    }
}

module.exports = {
    tagData
}
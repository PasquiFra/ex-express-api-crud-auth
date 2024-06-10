const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


const register = {
    email: {
        in: ['body'],
        notEmpty: {
            errorMessage: "L'email non può essere vuota",
            bail: true
        },
        isEmail: {
            errorMessage: "L'email deve avere un formato valido",
            bail: true
        },
        custom: {
            options: async (emailToCheck) => {
                const user = await prisma.user.findUnique({
                    where: { email: emailToCheck }
                });
                if (user) {
                    throw new Error("E' già presente un account con questa mail")
                };
                return true
            }
        }
    },
    username: {
        in: ['body'],
        isString: {
            errorMessage: "Lo username dev\'essere una stringa",
            bail: true
        },
        notEmpty: {
            errorMessage: "Lo username non può essere vuoto",
            bail: true
        },
        isLength: {
            errorMessage: "Lo username deve avere almeno 3 caratteri",
            options: { min: 3 }
        },
        custom: {
            options: async (usernameToCheck) => {
                const user = await prisma.user.findUnique({
                    where: { username: usernameToCheck }
                });
                if (user) {
                    throw new Error("E' già presente un account con questo username")
                };
                return true
            }
        }
    },
    password: {
        in: ['body'],
        notEmpty: {
            errorMessage: "La password non può essere vuota",
            bail: true
        },
        isLength: {
            errorMessage: "La password deve avere almeno 6 caratteri",
            options: { min: 6 }
        },
        isString: {
            errorMessage: "La password dev\'essere una stringa",
            bail: true
        }
    }
}

const login = {
    email: {
        in: ['body'],
        notEmpty: {
            errorMessage: "L'email non può essere vuota",
            bail: true
        },
        isEmail: {
            errorMessage: "L'email deve avere un formato valido",
            bail: true
        }
    },
    password: {
        in: ['body'],
        notEmpty: {
            errorMessage: "La password non può essere vuota",
            bail: true
        },
        isString: {
            errorMessage: "La password dev\'essere una stringa",
            bail: true
        }
    }
}

module.exports = {
    register,
    login
}
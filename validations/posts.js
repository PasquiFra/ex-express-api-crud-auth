const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const postData = {
    title: {
        in: ['body'],
        isString: {
            errorMessage: "Il titolo dev\'essere una stringa",
            bail: true
        },
        notEmpty: {
            errorMessage: "Il titolo non può essere vuoto",
            bail: true
        },
        isLength: {
            errorMessage: "Il titolo deve avere almeno 3 caratteri",
            options: { min: 3 }
        }
    },
    image: {
        in: ["body"],
        isString: {
            errorMessage: "Il campo immagine dev'essere una stringa",
            bail: true
        },
    },
    published: {
        in: ["body"],
        isBoolean: {
            errorMessage: "Il campo published dev'essere un booleano",
        }
    },
    content: {
        in: ["body"],
        isString: {
            errorMessage: "Il contenuto dev'essere un testo",
            bail: true
        }
    },
    categoryId: {
        in: ["body"],
        isInt: {
            errorMessage: "L'id della categoria dev'essere un numero intero",
            bail: true
        },
        custom: {
            options: async (idToCheck) => {
                const categoryId = parseInt(idToCheck);
                const category = await prisma.category.findUnique({
                    where: { id: categoryId }
                });
                if (!category) {
                    throw new Error(`Non esiste una Category con id ${categoryId}`);
                }
                return true;
            }
        }
    }
}

module.exports = {
    postData
}
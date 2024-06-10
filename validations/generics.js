const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const slugCheck = {
    slug: {
        in: ["params"],
        isString: {
            errorMessage: "Il parametro dev'essere una stringa",
            bail: true
        },
        custom: {
            options: async (slugToCheck) => {
                const slug = await prisma.post.findUnique({
                    where: { slug: slugToCheck }
                });
                if (!slug) {
                    throw new Error(`Non esiste nessun post con slug ${slugToCheck}`);
                }
                return true;
            }
        }

    }
}

const categoryName = {
    name: {
        in: ["params"],
        isString: {
            errorMessage: "Il parametro dev'essere una stringa",
            bail: true
        },
        custom: {
            options: async (nameToCheck) => {
                const name = await prisma.category.findMany({
                    where: { name: nameToCheck }
                });
                if (!name) {
                    throw new Error(`Non esiste nessuna categoria con nome ${nameToCheck}`);
                }
                return true;
            }
        }

    }
}

const tagName = {
    name: {
        in: ["params"],
        isString: {
            errorMessage: "Il parametro dev'essere una stringa",
            bail: true
        },
        custom: {
            options: async (nameToCheck) => {
                const name = await prisma.tag.findMany({
                    where: { name: nameToCheck }
                });
                if (!name) {
                    throw new Error(`Non esiste nessun tag con nome ${nameToCheck}`);
                }
                return true;
            }
        }

    }
}

module.exports = {
    slugCheck,
    categoryName,
    tagName
}
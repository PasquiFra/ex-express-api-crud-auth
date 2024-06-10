const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const errorHandler = require('../middlewares/errorHandler');

const slugger = async (title, posts) => {
    try {

        const posts = await prisma.post.findMany();

        const baseSlug = title.replaceAll(' ', '-').replaceAll('/', '-').toLowerCase()

        if (!baseSlug) {
            const err = new Error('Il titolo non è corretto o non contiene un numero minimo di caratteri');
            err.status = 401;
            return errorHandler(err, req, res);;
        }

        const slugs = posts.map(post => post.slug);

        let counter = 1;
        let slug = baseSlug;

        while (slugs.includes(slug)) {
            slug = `${baseSlug}-${counter}`;
            counter++
        }

        return slug
    } catch (err) {
        throw err;
    }
}

module.exports = slugger
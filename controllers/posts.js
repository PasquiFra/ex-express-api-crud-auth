const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//importo le funzioni di read e write in functions.js
const { deleteFile } = require('../utils/fileSystem.js');

const errorHandler = require('../middlewares/errorHandler');
const slugger = require("../utils/slugger");
const getUserId = require("../utils/getUserInfo");

const { storeFromPost } = require("../controllers/tags.js");

const store = async (req, res) => {

    const { title, image, content, categoryId, tags, userId } = req.body // TODO: aggiunto userId provvisoriamente
    try {

        //cerco lo userId associato all'email
        //!DISATTIVATO: validazione id utente tramite token
        // const { email } = req.user
        // const userId = await getUserId(email)

        // aggiungo un componente che si occuperà di creare uno slug unico
        const slug = await slugger(title);
        const tagIds = await storeFromPost(req, res, tags);

        if (!req.file || !req.file.mimetype.includes('image')) {
            req.file?.filename && deleteFile(req.file.filename);
            throw new Error("Image is missing or it is not an image file.", 400)
        }

        const postData = {
            title,
            slug,
            image: req.file.filename,
            content,
            published: req.body.published ? true : false,
            userId: parseInt(userId)
        }
        if (categoryId) {
            postData.categoryId = parseInt(categoryId);
        }

        const post = await prisma.post.create({
            data: {
                ...postData,
                tags: {
                    connect: tagIds.map(tagId => ({ id: tagId }))
                }
            }
        })

        res.status(200).send(post);

    } catch (err) {
        if (!req.file || !req.file.mimetype.includes('image')) {
            req.file?.filename && deleteFile(req.file.filename);
        }
        errorHandler(err, req, res);
    }
}

const showByPublished = async (req, res) => {

    try {
        const posts = await prisma.post.findMany({
            where: {
                published: true
            },
            include: {
                tags: {
                    select: { name: true }
                },
                category: {
                    select: { name: true }
                }
            }
        })
        return res.json({
            data: posts,
        });
    }
    catch (err) {
        errorHandler(err, req, res);
    }
}

const showByString = async (req, res) => {
    const string = req.query.string;

    try {
        const posts = await prisma.post.findMany({
            where: {
                OR: [
                    { title: { contains: string } },
                    { content: { contains: string } }
                ]
            },
            include: {
                category: {
                    select: { name: true }
                },
                tags: {
                    select: { name: true }
                }
            }
        });
        return res.json({ data: posts });
    } catch (err) {
        errorHandler(err, req, res);
    }
}

const index = async (req, res) => {

    try {
        if (req.query.string) {
            await showByString(req, res);
        } else if (req.query.published) {
            await showByPublished(req, res);
        } else {
            const posts = await prisma.post.findMany({
                include: {
                    tags: {
                        select: { name: true }
                    },
                    category: {
                        select: { name: true }
                    }
                }
            })
            res.json({
                data: posts,
            });
        }
    } catch (err) {
        errorHandler(err, req, res);
    }
}

const show = async (req, res) => {

    try {
        const slug = req.params.slug;
        const post = await prisma.post.findUnique({
            where: {
                slug: slug
            },
            include: {
                tags: {
                    select: { name: true }
                },
                category: {
                    select: { name: true }
                }
            }
        })
        if (post) {
            res.json(post)
        } else {
            throw new Error(`Post con slug ${slug} non trovato.`, 404);
        }
    }
    catch (err) {
        errorHandler(err, req, res);
    }

}

const update = async (req, res) => {

    const slugToChange = req.params.slug

    try {

        // cerco il post da cambiare e prendo il suo userId
        const postToChange = await prisma.post.findUnique({ where: { slug: slugToChange } });
        const postToChangeUserID = postToChange.userId

        //cerco lo userId associato all'email
        const { email } = req.user
        const loggedUserId = await getUserId(email)

        //! verifico che lo userId del post da cambiare corrisponda allo userId dell'utente loggato
        if (loggedUserId != postToChangeUserID) {
            throw new Error("Non sei autorizzato a modificare questo post", 405)
        }

        const { title, slug, image, content, categoryId, tags, userId } = req.body

        const data = {
            title,
            slug,
            image,
            content,
            published: req.body.published ? true : false,
            tags: {
                connect: tags.map(id => ({ id }))
            },
            userId
        }
        if (categoryId) {
            data.categoryId = categoryId;
        }

        const post = await prisma.post.update({ where: { slug: slugToChange }, data })
        res.json(post);
    }
    catch (err) {
        errorHandler(err, req, res);
    }
}


const destroy = async (req, res) => {

    try {
        const slug = req.params.slug

        // cerco il post da cancellare e prendo il suo userId
        const postToDelete = await prisma.post.findUnique({ where: { slug: slug } });
        const postToDeleteUserID = postToDelete.userId

        //cerco lo userId associato all'email
        const { email } = req.user
        const loggedUserId = await getUserId(email)

        //! verifico che lo userId del post da cambiare corrisponda allo userId dell'utente loggato
        if (loggedUserId != postToDeleteUserID) {
            throw new Error("Non sei autorizzato a cancellare questo post", 405)
        }

        deleteFile(postToDelete.image);

        await prisma.post.delete({ where: { slug } })
        res.json(`Post con slug ${slug} eliminato con successo.`);
    }
    catch {
        err => console.error(err)
    };
}

module.exports = {
    store,
    index,
    show,
    update,
    destroy
}
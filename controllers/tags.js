const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const errorHandler = require('../middlewares/errorHandler')

const store = async (req, res) => {

    const { name } = req.body;

    const data = { name }

    try {
        const existingTag = await prisma.tag.findUnique({
            where: {
                name: data.name
            }
        });
        if (!existingTag) {
            const generatedTag = await prisma.tag.create({ data });
            res.status(200).send(generatedTag);
        } else {
            throw new Error("Tag già esistente")
        }
    } catch (err) {
        errorHandler(err, req, res);
    }

}

const storeFromPost = async (req, res, tags) => {

    try {
        const tagIds = [];
        const tagPromises = tags.map(async tag => {
            const existingTag = await prisma.tag.findUnique({
                where: {
                    name: tag
                }
            });
            if (!existingTag) {
                const newTag = await prisma.tag.create({ data: { name: tag } });
                tagIds.push(newTag.id)
            } else {
                tagIds.push(existingTag.id)
            }
        });
        await Promise.all(tagPromises);

        return tagIds
    } catch (err) {
        errorHandler(err, req, res);
    }

}

const index = async (req, res) => {
    try {
        const tags = await prisma.tag.findMany();
        //console.log("entrato tags", tags)
        res.json(tags);
    } catch (err) {
        errorHandler(err, req, res);
    }
}

const show = async (req, res) => {
    const tagToCheck = req.params.name

    try {
        const tag = await prisma.tag.findMany({
            where: { name: tagToCheck }
        })

        res.json(tag);
    } catch (err) {
        errorHandler(err, req, res);
    }
}

const update = async (req, res) => {
    const tagToCheck = req.params.name
    const newName = req.body.name

    try {
        const tag = await prisma.tag.findMany({
            where: { name: tagToCheck }
        })

        // setto l'id da aggiornare
        const tagId = tag[0].id

        // imposto il data della modifica
        const data = {
            name: newName
        }

        // controllo che sia stata trovata la categoria da modficare
        if (!tag) {
            throw new Error(`Non esiste un tag con questo nome`)
        }

        // aggiorno la categoria
        const updateTag = await prisma.tag.update({ where: { id: tagId }, data })

        // restituisco il risultato
        res.status(200).json("Tag modificato con successo:", updateTag)

    } catch (err) {
        errorHandler(err, req, res);
    }
}

const destroy = async (req, res) => {
    const tagToCheck = req.params.name

    try {
        const tag = await prisma.tag.findMany({
            where: { name: tagToCheck }
        })

        // setto l'id da aggiornare
        const tagId = tag[0].id

        await prisma.tag.delete({ where: { id: tagId } })
        res.json(`Tag con id ${tagId} eliminato con successo.`);
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
    destroy,
    storeFromPost
}
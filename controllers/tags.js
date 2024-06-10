const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const errorHandler = require('../middlewares/errorHandler')

const store = async (req, res) => {

    console.log("entrato tags 1")

    const { name } = req.body;

    const data = { name }

    try {
        const tag = await prisma.tag.create({ data });
        res.status(200).send(tag);
    } catch (err) {
        errorHandler(err, req, res);
    }

}

const index = async (req, res) => {

    console.log("entrato tags 2")

    try {
        const tags = await prisma.tag.findMany();
        res.json(tags);
    } catch (err) {
        errorHandler(err, req, res);
    }
}

const show = async (req, res) => {
    const tagToCheck = req.params.name
    console.log(tagToCheck)

    try {
        const tag = await prisma.tag.findMany({
            where: { name: tagToCheck }
        })
        console.log(tag)
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
    destroy
}
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const errorHandler = require('../middlewares/errorHandler')

const store = async (req, res) => {

    const { name } = req.body;

    const data = { name }

    try {
        const category = await prisma.category.create({ data });
        res.status(200).send(category);
    } catch (err) {
        errorHandler(err, req, res);
    }

}

const index = async (req, res) => {

    console.log("entrato categories 2")

    try {
        const categories = await prisma.category.findMany();
        res.json(categories);
    } catch (err) {
        errorHandler(err, req, res);
    }
}

const show = async (req, res) => {
    const categoryToCheck = req.params.name
    try {
        const category = await prisma.category.findMany({
            where: { name: categoryToCheck }
        })
        res.json(category);
    } catch (err) {
        errorHandler(err, req, res);
    }
}
const update = async (req, res) => {
    const categoryToCheck = req.params.name
    const newName = req.body.name

    try {
        const category = await prisma.category.findMany({
            where: { name: categoryToCheck }
        })

        // setto l'id da aggiornare
        const catId = category[0].id

        // imposto il data della modifica
        const data = {
            name: newName
        }

        // controllo che sia stata trovata la categoria da modficare
        if (!category) {
            throw new Error(`Non esiste una categoria con questo nome`)
        }

        // aggiorno la categoria
        const updateCategory = await prisma.category.update({ where: { id: catId }, data })

        // restituisco il risultato
        res.status(200).json("categoria modificata con successo:", updateCategory)

    } catch (err) {
        errorHandler(err, req, res);
    }
}
const destroy = async (req, res) => {
    const categoryToCheck = req.params.name

    try {
        const category = await prisma.category.findMany({
            where: { name: categoryToCheck }
        })

        // setto l'id da aggiornare
        const catId = category[0].id

        await prisma.category.delete({ where: { id: catId } })
        res.json(`Categoria con id ${catId} eliminata con successo.`);
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
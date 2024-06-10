const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const errorHandler = require('../middlewares/errorHandler');

const getUserId = async (emailToFind) => {
    try {

        const user = await prisma.user.findUnique({
            where: { email: emailToFind }
        });

        const userId = user.id
        return userId
    } catch (err) {
        errorHandler(err, req, res);
    }
}

module.exports = getUserId
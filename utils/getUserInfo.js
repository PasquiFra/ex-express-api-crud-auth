const jwt = require("jsonwebtoken");
require("dotenv").config();

const errorHandler = require('../middlewares/errorHandler');

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getUserId = async (tokenToCheck) => {
    try {
        let userInfo;

        if (!tokenToCheck) {
            throw new Error('Token non fornito', 401);
        }
        jwt.verify(tokenToCheck, process.env.JWT_KEY, (err, payload) => {
            if (err) {
                err.message == "jwt expired" ? err.message = "token scaduto" : err.message = "Autenticazione fallita, effettua il login"
                err.status = 401;
                return errorHandler(err, req, res, next)
            }
            //se l'user che ricevo nella decodifica corrisponde lo assegno nella request
            userInfo = payload;
        });

        const user = await prisma.user.findUnique({
            where: { email: userInfo.email }
        });

        const userId = user.id

        return userId
    } catch (err) {
        console.error(err);
        throw new Error('User not found')
    }
}

module.exports = getUserId
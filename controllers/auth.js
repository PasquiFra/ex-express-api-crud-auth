const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { hashedPassword } = require('../utils/password');
const { generateToken, comparePassword } = require('../utils/token.js');

const errorHandler = require("../middlewares/errorHandler");

const registerController = async (req, res) => {
    try {
        const { username, email, password } = req.body
        const data = {
            username,
            email,
            password: await hashedPassword(password) //genero una password hashata da salvare nel DB
        }

        const user = await prisma.user.create({ data });

        //Se la registrazione va a buon fine do un token di login all'utente
        const token = generateToken({
            email: user.email,
            username: user.username
        });

        delete user.id;
        delete user.password;

        res.json({ token, data: user });
    } catch (err) {
        errorHandler(err, req, res);
    }
}
const loginController = async (req, res) => {
    try {

        const { email, password } = req.body

        console.log(email, password)

        const userLogin = await prisma.user.findUnique({
            where: { email: email }
        })


        if (!userLogin) {
            throw new Error("email o password non corretta", 400)
        }

        console.log("utente trovato", userLogin)

        const isPasswordCorrect = await comparePassword(password, userLogin.password)

        if (!isPasswordCorrect) {
            throw new Error("email o password non corretta", 400)
        }

        //Se il login va a buon fine restituisco un token all'utente
        const token = generateToken({
            email: userLogin.email,
            username: userLogin.username
        });

        delete userLogin.id;
        delete userLogin.password;

        res.json({ token, data: userLogin });
    } catch (err) {
        errorHandler(err, req, res);
    }
}

module.exports = {
    registerController,
    loginController
}

//importo il modulo che si occuperà di hashare la password
const bcrypt = require("bcrypt");
require("dotenv").config();

const pepperKey = process.env.PEPPER_KEY;

const hashedPassword = async (password) => {

    // Genero un salt da 10x rounds
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password + pepperKey, salt);

    return hashedPassword
}

module.exports = {
    hashedPassword
}
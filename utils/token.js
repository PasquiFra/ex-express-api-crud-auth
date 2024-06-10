const jwt = require("jsonwebtoken");
require("dotenv").config();
//importo il modulo che si occuperà di hashare la password
const bcrypt = require("bcrypt");

const generateToken = (payload, expiresIn = '2h') => {
    return token = jwt.sign(payload, process.env.JWT_KEY, { expiresIn })
}

const comparePassword = async (passwordToCheck, hashedPassword) => {
    passwordCheck = await bcrypt.compare(passwordToCheck + process.env.PEPPER_KEY, hashedPassword)
    return passwordCheck
}

module.exports = { generateToken, comparePassword }
const express = require("express");
const router = express.Router();
const validator = require('../middlewares/validator.js');
const { register, login } = require("../validations/auth.js")

const {
    register,
    login
} = require('../controllers/auth');

// Rotte di /auth
router.post("/register", validator(register), register)
router.post("/login", validator(login), login)


module.exports = router;
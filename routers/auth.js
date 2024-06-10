const express = require("express");
const router = express.Router();
const validator = require('../middlewares/validator.js');
const { registerValidation, loginValidation } = require("../validations/auth.js")

const {
    registerController,
    loginController
} = require('../controllers/auth');

// Rotte di /auth
router.post("/register", validator(registerValidation), registerController)
router.post("/login", validator(loginValidation), loginController)


module.exports = router;
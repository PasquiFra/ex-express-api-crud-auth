const express = require("express");
const router = express.Router();
const { loggedUsers } = require("../middlewares/authUsers.js");

const {
    store,
    index,
    show,
    update,
    destroy
} = require('../controllers/posts');

const multer = require("multer");
const uploader = multer({ dest: "public/img" });

const validator = require('../middlewares/validator.js');
const { postData } = require('../validations/posts.js')
const { slugCheck } = require('../validations/generics.js')


// Rotte di /posts

//! DISATTIVATO: router.use('/', loggedUsers);

router.post('/', uploader.single("image"), validator(postData), store);
router.get('/', index);

router.use('/:slug', validator(slugCheck))

router.get('/:slug', show);
router.put('/:slug', validator(postData), update);
router.delete('/:slug', destroy)

module.exports = router;
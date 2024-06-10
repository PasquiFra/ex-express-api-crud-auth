const express = require("express");
const router = express.Router();

const {
    store,
    index,
    show,
    update,
    destroy
} = require('../controllers/posts');

// Rotte di /posts

const validator = require('../middlewares/validator.js');
const { postData } = require('../validations/posts.js')
const { slugCheck } = require('../validations/generics.js')

router.post('/', validator(postData), store);
router.get('/', index);

router.use('/:slug', validator(slugCheck))

router.get('/:slug', show);
router.put('/:slug', validator(postData), update);
router.delete('/:slug', destroy)

module.exports = router;
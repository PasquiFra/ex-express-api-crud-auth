const express = require("express");
const router = express.Router();
const {
    store,
    index,
    show,
    update,
    destroy
} = require("../controllers/tags.js");

const validator = require('../middlewares/validator.js');
const { tagData } = require('../validations/tags.js')
const { tagName } = require('../validations/generics.js')

router.post('/', validator(tagData), store);
router.get('/', index);

router.use('/:name', validator(tagName))

router.get('/:name', show);
router.put('/:name', validator(tagData), update);
router.delete('/:name', destroy);

module.exports = router;
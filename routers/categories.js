const express = require("express");
const router = express.Router();
const {
    store,
    index,
    show,
    update,
    destroy
} = require('../controllers/categories.js');


const validator = require('../middlewares/validator.js');
const { categoryData } = require('../validations/categories.js')
const { categoryName } = require('../validations/generics.js')

router.post('/', validator(categoryData), store);
router.get('/', index);

router.use('/:name', validator(categoryName))

router.get('/:name', show);
router.put('/:name', validator(categoryData), update);
router.delete('/:name', destroy);


module.exports = router;
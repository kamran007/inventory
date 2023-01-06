const cost = require("../models/cost");
const {authenticatedUser,isAdmin} = require('../middlewares/authMiddleware')
const {getCostInsertForm,postCostInsertForm} =require('../controllers/costController');

const router = require('express').Router()

router.get('/insert',authenticatedUser,getCostInsertForm);
router.post('/insert',authenticatedUser,postCostInsertForm)

module.exports= router;
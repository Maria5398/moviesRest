var express = require('express');
var router = express.Router();

const {getAll,getById, create} = require('../controllers/apiMoviesController');

//api/movies
router.get('/', getAll);
router.get('/:id',getById);
router.post('/create', create);


module.exports = router;

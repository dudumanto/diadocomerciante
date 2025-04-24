const express = require('express');
const router = express.Router();
const distritalController = require('../controllers/distritalController');


router.post("/cadastrar", distritalController.cadastrarDistrital);
router.get('/listar', distritalController.listarDistritais);
router.get('/:id', distritalController.obterDistritalPorId);

module.exports = router;

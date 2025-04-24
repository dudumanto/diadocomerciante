const express = require('express');
const router = express.Router();
const participanteController = require('../controllers/participanteController');
const autenticar = require("../middlewares/authMiddleware") 


router.post('/convidar',autenticar, participanteController.convidarParticipante);
router.get('/confirmar-presenca/:codigoConvite', participanteController.validarPresenca);
router.get('/aceitar-convite/:codigoConvite', participanteController.aceitarConvite);
router.get('/listar', autenticar, participanteController.listarParticipantes);
router.get('/listar-todos', autenticar, participanteController.listarTodos);



module.exports = router;
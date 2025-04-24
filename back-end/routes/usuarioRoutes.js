const express = require("express");
const router = express.Router(); 
const usuarioController = require("../controllers/usuarioController");
const authMiddleware = require("../middlewares/authMiddleware"); 
const adminMiddleware = require("../middlewares/adminMiddleware");


router.post("/cadastrar", adminMiddleware, usuarioController.cadastrarUsuario);


module.exports = router;
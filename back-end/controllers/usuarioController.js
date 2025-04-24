const usuarioService = require("../services/usuarioService");



async function cadastrarUsuario(req, res){
     try{
        const {nome, email, senha, distrital_id, limite_participantes} = req.body;
        if(!nome || !email || !senha || !distrital_id || !limite_participantes){
            return res.status(400).json({error:"Todos os campos são obrigatórios!"});
        }
        const role = "usuario";
        const result = await usuarioService.cadastrarUsuario({
            nome,
            email,
            senha,
            distrital_id,
            limite_participantes,
            role,
        });
        if(result.error){
            return res.status(400).json({error: result.error});
        }
        return res.status(201).json({message:"Usuário responsável cadastrado", id: result.id});
     }catch (error){
        console.error(error);
        res.status(500).json({error:"Erro interno no servidor"});
     }
}



module.exports = { cadastrarUsuario};
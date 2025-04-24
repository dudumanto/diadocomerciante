const db = require('./database');
const bcrypt = require('bcryptjs');

async function cadastrarUsuario({nome, email, senha, distrital_id, limite_participantes, role}){
    try{
        const senhaHasheada = await bcrypt.hash(senha, 10);
        const [result] = await db.query(
          'INSERT INTO users(name, email, password, distrital_id, limite_participantes, role) VALUES (?, ?, ?, ?, ?, ?)',
          [nome, email, senhaHasheada, distrital_id, limite_participantes, role]
        );
        return {sucess: true, id: result.insertId};
    }catch (error){
        console.error(error);
        return {error: "Erro ao cadastrar usuário"};
    }
}
module.exports = {cadastrarUsuario};
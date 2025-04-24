const authService = require('../services/authService');

const register = async (req, res) => {
    try {
        const { name, email, password, isAdmin } = req.body;
        const role = isAdmin ? 'admin' : 'user';
        const userId = await authService.registerUser(name, email, password, role);
        res.status(201).json({ message: 'Usuário registrado com sucesso!', userId });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { token, user } = await authService.loginUser(email, password); 
        if (!token) {
            return res.status(401).json({ message: "Credenciais inválidas" }); 
        }
        return res.json({ message: "Login bem-sucedido!", token, role: user.role }); 
    } catch (error) {
        console.error("Erro no login:", error);
        return res.status(500).json({ error: "Erro ao fazer login" }); 
    }
};

module.exports = { register, login };

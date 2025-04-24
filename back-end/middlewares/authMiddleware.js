const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Acesso negado. Nenhum token fornecido.' });
  }

  try {
    const tokenLimpo = token.split(' ')[1]; 
    const decoded = jwt.verify(tokenLimpo, process.env.JWT_SECRET);
    req.user = decoded; 
    console.log('Usuário autenticado:', decoded);
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido.' });
  }
};

module.exports = authMiddleware;

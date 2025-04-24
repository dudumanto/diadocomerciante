const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require("./routes/usuarioRoutes");
const distritalRoutes = require("./routes/distritalRoutes");
const participanteRoutes = require('./routes/participanteRoutes');
const app = express();

dotenv.config();

console.log("🔐 JWT_SECRET carregado:", process.env.JWT_SECRET);

app.use(cors());
app.use(express.json());

console.log("✅ Iniciando servidor...");
console.log("✅ Rotas registradas:");
console.log("🚀 /api/auth -> authRoutes");
console.log("🚀 /api/usuarios -> usuarioRoutes");
console.log("🚀 /api/distrital -> distritalRoutes");

app.use('/api/auth', authRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use('/api/distrital', distritalRoutes);
app.use('/api/participantes', participanteRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
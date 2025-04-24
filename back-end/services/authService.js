const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("./database");
const dotenv = require("dotenv");

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";


const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.is_admin ? "admin" : "usuario",
            distrital_id: user.distrital_id || null 
        },
        JWT_SECRET,
        { expiresIn: "3h" }
    );
};


const registerUser = async (name, email, password, isAdmin, distritalId) => {
    try {
        console.log(" Registrando usuário:", { name, email, isAdmin, distritalId });

        const hashedPassword = await bcrypt.hash(password, 10);

        
        const [result] = await db.query(
            "INSERT INTO users (name, email, password, is_admin, distrital_id) VALUES (?, ?, ?, ?, ?)",
            [name, email, hashedPassword, isAdmin ? 1 : 0, distritalId || null]
        );

        console.log("✅ Usuário registrado com sucesso! ID:", result.insertId);
        return result.insertId;
    } catch (error) {
        console.error("❌ Erro ao registrar usuário:", error);
        throw new Error("Erro ao registrar usuário");
    }
};


const loginUser = async (email, password) => {
    try {
        console.log("🔹 Buscando usuário no banco:", email);
        const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

        if (rows.length === 0) {
            console.log("❌ Usuário não encontrado!");
            return null;
        }

        const user = rows[0];
        console.log("✅ Usuário encontrado:", user);

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            console.log("❌ Senha incorreta!");
            return null;
        }

        console.log("🔑 Senha correta, gerando token...");
        const token = generateToken(user); 

        console.log("✅ Token gerado com sucesso!");
        return { token, user };
    } catch (error) {
        console.error("❌ Erro ao fazer login:", error);
        throw new Error("Erro ao processar login");
    }
};

module.exports = { registerUser, loginUser };

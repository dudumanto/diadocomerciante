const db = require('./database');

const cadastrarDistrital = async (nome, limite_participantes) => {
    if (!nome || !limite_participantes) {
        throw new Error('Nome e limite são obrigatórios.');
    }

    const [result] = await db.execute(
        'INSERT INTO distritais (nome, limite_participantes) VALUES (?, ?)',
        [nome, limite_participantes]
    );

    return result.insertId;
};

const listarDistritais = async () => {
    const [distritais] = await db.execute('SELECT * FROM distritais');
    return distritais;
};

const listarDistritaisId = async (id) => {
    const [distritais] = await db.execute('SELECT * FROM distritais WHERE id = ?', [id]);
    return distritais;
};

module.exports = {
    cadastrarDistrital,
    listarDistritais,
    listarDistritaisId
};

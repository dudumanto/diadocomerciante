const distritalService = require('../services/distritalService');

const cadastrarDistrital = async (req, res) => {
    try {
        const { nome, limite_participantes } = req.body;
        const id = await distritalService.cadastrarDistrital(nome, limite_participantes);
        res.status(201).json({ message: 'Distrital cadastrada com sucesso!', id });
    } catch (error) {
        console.error('Erro ao cadastrar distrital:', error);
        res.status(400).json({ error: error.message });
    }
};

const listarDistritais = async (req, res) => {
    try {
        const distritais = await distritalService.listarDistritais();
        res.json(distritais);
    } catch (error) {
        console.error('Erro ao buscar distritais:', error);
        res.status(500).json({ error: 'Erro no servidor' });
    }
};

const obterDistritalPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const distrital = await distritalService.listarDistritaisId(id);
        if (distrital.length === 0) {
            return res.status(404).json({ error: 'Distrital não encontrada' });
        }
        res.json(distrital[0]);
    } catch (error) {
        console.error('Erro ao buscar distrital por ID:', error);
        res.status(500).json({ error: 'Erro no servidor' });
    }
};
module.exports = {
    cadastrarDistrital,
    listarDistritais,
    obterDistritalPorId
};

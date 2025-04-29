const participanteService = require('../services/participanteService');


const convidarParticipante = async (req, res) => {
    try {
        const { nome, email, distrital_id } = req.body;
        console.log("Dados recebidos:", nome, email, distrital_id);
        const usuarioLogado = req.user;
        console.log("Usuário logado:", usuarioLogado);
        if (usuarioLogado.distrital_id !== distrital_id) {
            return res.status(403).json({ error: 'Você só pode convidar participantes para sua distrital.' });
        }
        const distrital = await participanteService.buscarDistrital(distrital_id);
        console.log("Dados da distrital:", distrital);
        if (!distrital || distrital.limite_participantes <= 0) {
            return res.status(400).json({ error: 'Não há mais vagas disponíveis para esta distrital.' });
        }
        const participanteId = await participanteService.criarConviteQrCode (nome, email, distrital_id);
        console.log("Participante criado com ID:", participanteId);
        await participanteService.reduzirLimiteDistrital(distrital_id);
        res.status(201).json({ message: 'Convite enviado com sucesso!', id: participanteId });
    } catch (error) {
        console.error("Erro no try:", error);
        res.status(500).json({ error: 'Erro ao enviar convite.' });
    }
};

const validarPresenca = async (req, res) => {
    try {
        const { codigoConvite } = req.params;
        const confirmado = await participanteService.confirmarPresenca(codigoConvite);
        if (!confirmado) {
            return res.status(404).json({ error: 'Convite não encontrado ou já confirmado.' });
        }
        res.json({ message: 'Presença confirmada com sucesso!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao confirmar presença.' });
    }
};


const aceitarConvite = async (req, res) => {
    try {
        const { codigoConvite } = req.params;
        const confirmado = await participanteService.confirmarConvite(codigoConvite);
        if (!confirmado) {
            return res.status(404).json({ error: 'Convite inválido ou já confirmado.' });
        }
        const participante = await participanteService.buscarParticipantePorCodigo(codigoConvite);
        const { qrCodeData, filePath } = await participanteService.gerarQRCode(codigoConvite);
        await participanteService.enviarEmailConvite(participante.nome, participante.email, `cid:qrcode`, qrCodeData, filePath);
        res.json({ message: 'Confirmação feita com sucesso! QR Code enviado por e-mail.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao confirmar convite.' });
    }
};

const listarParticipantes = async (req, res) =>{
    try{
        const usuarioLogado = req.user;
        const distrital_id = usuarioLogado.distrital_id;

        const participantes = await participanteService.listarParticipantes(distrital_id);
        res.json(participantes);
    }catch (error){
        console.error("Error ao listar participantes:", error);
        res.status(500).json({error:'Erro ao buscar participantes'});
    }
}
const listarTodos = async (req, res) => {
    try {
        const usuarioLogado = req.user;
        if (usuarioLogado.role !== 'admin') {
            return res.status(403).json({ message: 'Acesso negado' });
        }
        const participantes = await participanteService.listarTodosParticipantes();
        res.status(200).json(participantes);
    } catch (error) {
        console.error('Erro ao listar todos os participantes:', error);
        res.status(500).json({ error: 'Erro ao listar participantes' });
    }
};


module.exports = {
    convidarParticipante,
    validarPresenca,
    aceitarConvite,
    listarParticipantes,
    listarTodos
};

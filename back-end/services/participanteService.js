const db = require('./database'); 
const QRCode = require('qrcode');
const nodemailer = require('nodemailer');
const path = require('path');

const criarConviteQrCode = async (nome, email, distrital_id) => {
    const codigoConvite = generateUniqueCode();

    const data_evento = "2025-04-20";
    const data_envio = new Date();
  
    const [result] = await db.query(
      'INSERT INTO participantes_evento (nome, email, distrital_id, codigo_convite, confirmar_presenca, presenca, data_evento, data_envio) VALUES (?, ?, ?, ?, 0, 0, ?, ?)',
      [nome, email, distrital_id, codigoConvite, data_evento, data_envio] 
    );
  
    await enviarEmailConfirmacaoConvite(nome, email, codigoConvite);
  
    return result.insertId;
  };

const confirmarPresenca = async (codigoConvite) => {
    const [result] = await db.query(
        'UPDATE participantes_evento SET presenca = TRUE WHERE codigo_convite = ?',
        [codigoConvite]
    );
    return result.affectedRows > 0;
};

const confirmarConvite = async (codigoConvite) => {
    const [result] = await db.query(
        'UPDATE participantes_evento SET confirmar_presenca = 1 WHERE codigo_convite = ?',
        [codigoConvite]
    );
    return result.affectedRows > 0;
};

const buscarParticipantePorCodigo = async (codigoConvite) => {
    const [[participante]] = await db.query(
        'SELECT nome, email, distrital_id FROM participantes_evento WHERE codigo_convite = ?',
        [codigoConvite]
    );
    return participante;
};

const gerarQRCode = async (codigoConvite) => {
    const qrCodeData = `http://localhost:3000/confirmar-presenca/${codigoConvite}`;
    const filePath = path.join(__dirname, '..', 'qrcodes', `${codigoConvite}.png`);
    await QRCode.toFile(filePath, qrCodeData);
    return { qrCodeData, filePath };
};

const buscarDistrital = async (id) => {
    const [[distrital]] = await db.query(
        'SELECT limite_participantes FROM distritais WHERE id = ?',
        [id]
    );
    return distrital;
};

const reduzirLimiteDistrital = async (id) => {
    await db.query(
        'UPDATE distritais SET limite_participantes = limite_participantes - 1 WHERE id = ?',
        [id]
    );
};

const generateUniqueCode = () => {
    return Math.random().toString(36).substr(2, 9); 
};

const enviarEmailConfirmacaoConvite = async (nome, email, codigoConvite) => {
    const linkConfirmacao = `http://localhost:3000/aceitar-convite/${codigoConvite}`;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'eventos2@acsp.com.br',
            pass: 'eventos@123',
        }
    });

    const mailOptions = {
        from: 'eventos2@acsp.com.br',
        to: email,
        subject: '🎉 Confirmação de Presença - Festa do Dia do Comerciante 2025',
        html: `
        <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
            <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                <div style="background-color: #4caf50; color: white; text-align: center; padding: 20px; font-size: 20px;">
                    🎟️ Confirme sua Presença - Dia do Comerciante 2025
                </div>
                <div style="padding: 30px; text-align: center;">
                    <h2 style="color: #333;">Olá, ${nome}!</h2>
                    <p style="font-size: 16px;">
                        Que alegria ter você com a gente! <br>
                        Para garantir sua participação na <strong>Festa do Dia do Comerciante 2025</strong>,
                        clique no botão abaixo e confirme sua presença:
                    </p>
                    <a href="${linkConfirmacao}" 
                        style="display: inline-block; margin: 20px auto; padding: 12px 25px; background-color: #4caf50; color: white; 
                        text-decoration: none; font-weight: bold; border-radius: 5px; font-size: 16px;">
                        ✅ Confirmar Presença
                    </a>
                    <p style="font-size: 12px; color: #888; margin-top: 30px;">
                        Sua confirmação é pessoal e intransferível. <br>
                        Validade do convite: até 10 de julho de 2025.
                    </p>
                </div>
                <div style="background-color: #f1f1f1; text-align: center; padding: 10px; font-size: 13px; color: #666;">
                    Equipe ACSP<br>
                    <small>Não responda a este e-mail. Dúvidas? Fale conosco.</small>
                </div>
            </div>
        </div>
        `
    };

    await transporter.sendMail(mailOptions);
};

const enviarEmailConvite = async (nome, email, cid, qrCodeData, filePath) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'eventos2@acsp.com.br',
            pass: 'eventos@123',
        }
    });

    const mailOptions = {
        from: 'eventos2@acsp.com.br',
        to: email,
        subject: '🎉 Você foi convidado para a Festa do Dia do Comerciante 2025',
        html: `
            <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
            <div style="max-width: 600px; margin: auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                <div style="background-color: #6200ea; color: white; text-align: center; padding: 20px; font-size: 20px;">
                    🎉 Convite Especial - Dia do Comerciante 2025
                </div>
                <div style="padding: 30px; text-align: center;">
                    <h2 style="color: #333;">Olá, ${nome}!</h2>
                    <p style="font-size: 16px;">
                        Você foi <strong>convidado</strong> para participar da
                        <strong>Festa do Dia do Comerciante 2025</strong>! <br>
                        Será uma noite memorável com atrações especiais, homenagens e muita celebração!
                    </p>
                    <p style="font-size: 15px; margin-top: 20px;">
                        Apresente este QR Code na entrada:
                    </p>
                    <img src="cid:qrcode" alt="QR Code" style="margin: 20px auto; max-width: 200px;" />
                    <p>Ou confirme sua presença clicando abaixo:</p>
                    <p style="font-size: 12px; color: #888; margin-top: 30px;">
                        Este convite é pessoal e intransferível. <br>
                        Válido até 10 de julho de 2025.
                    </p>
                </div>
                <div style="background-color: #f1f1f1; text-align: center; padding: 10px; font-size: 13px; color: #666;">
                    Equipe ACSP<br>
                    <small>Não responda a este e-mail. Dúvidas? Fale conosco.</small>
                </div>
            </div>
        </div>
        `,
        attachments: [
            {
                filename: 'qrcode.png',
                path: filePath,
                cid: 'qrcode'
            }
        ]
    };

    await transporter.sendMail(mailOptions);
};

const listarParticipantes = async(distrital_id) =>{
    const [participantes] = await db.query(
        'SELECT id, nome, email, codigo_convite, confirmar_presenca, presenca FROM participantes_evento WHERE distrital_id = ?',
        [distrital_id]
    );
    return participantes;
}

const listarTodosParticipantes = async () => {
    const [participantes] = await db.query(
        'SELECT id, nome, email, codigo_convite, confirmar_presenca, presenca, distrital_id FROM participantes_evento'
    );
    return participantes;
};

module.exports = {
    criarConviteQrCode,
    confirmarPresenca,
    buscarDistrital,
    reduzirLimiteDistrital,
    confirmarConvite,
    enviarEmailConvite,
    buscarParticipantePorCodigo,
    gerarQRCode,
    listarParticipantes,
    listarTodosParticipantes
};

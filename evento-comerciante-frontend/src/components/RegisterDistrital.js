import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Typography, Container, Modal, Box, Paper } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

const RegisterDistrital = () => {
  const [nome, setNome] = useState("");
  const [limiteParticipantes, setLimiteParticipantes] = useState("");
  const [mensagem, setMensagem] = useState(null);
  const [erro, setErro] = useState(null);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(null);
    setMensagem(null);

    try {
    
      const apiUrl = `${process.env.REACT_APP_API_URL}/distrital/cadastrar`;

      await axios.post(apiUrl, {
        nome,
        limite_participantes: limiteParticipantes,
      });

      setMensagem("Distrital cadastrada com sucesso!");
      setNome("");
      setLimiteParticipantes("");
      setOpen(true);
    } catch (error) {
      setErro("Erro ao cadastrar distrital. Tente novamente.");
      console.error("Erro ao cadastrar distrital:", error);
      setOpen(true);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 3, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom color="primary">
          Cadastrar Distrital
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nome da Distrital"
            variant="outlined"
            fullWidth
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Limite de Participantes"
            type="number"
            variant="outlined"
            fullWidth
            value={limiteParticipantes}
            onChange={(e) => setLimiteParticipantes(e.target.value)}
            margin="normal"
          />
          <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2, py: 1.2 }}>
            Cadastrar
          </Button>
        </form>
      </Paper>

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 380,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            textAlign: "center",
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {mensagem ? (
            <CheckCircleIcon sx={{ fontSize: 60, color: "green", mb: 1 }} />
          ) : (
            <ErrorIcon sx={{ fontSize: 60, color: "red", mb: 1 }} />
          )}

          <Typography variant="h6" fontWeight="bold">
            {mensagem ? "Sucesso!" : "Erro"}
          </Typography>
          <Typography color={mensagem ? "green" : "red"} sx={{ mb: 2 }}>
            {mensagem || erro}
          </Typography>
          <Button variant="contained" color="primary" onClick={() => setOpen(false)} sx={{ px: 4 }}>
            Fechar
          </Button>
        </Box>
      </Modal>
    </Container>
  );
};

export default RegisterDistrital;

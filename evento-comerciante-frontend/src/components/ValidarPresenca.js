import React, { useState } from "react";
import { QrReader } from "react-qr-reader";
import axios from "axios";
import { Typography, Container, Paper, Alert } from "@mui/material";

const ValidarPresenca = () => {
  const [resultado, setResultado] = useState(null);

  const handleScan = async (data) => {
    if (data) {
      try {
        const userId = data.split("/").pop(); 
        await axios.get(`http://localhost:5000/api/usuarios/validar-presenca/${userId}`);
        setResultado({ type: "success", message: "Presença confirmada com sucesso!" });
      } catch (error) {
        setResultado({ type: "error", message: "Erro ao confirmar presença." });
      }
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom color="primary" align="center">
          Validador de Presença
        </Typography>

        {resultado && <Alert severity={resultado.type}>{resultado.message}</Alert>}

        <QrReader
          onResult={(result) => handleScan(result?.text)}
          style={{ width: "100%" }}
        />
      </Paper>
    </Container>
  );
};

export default ValidarPresenca;

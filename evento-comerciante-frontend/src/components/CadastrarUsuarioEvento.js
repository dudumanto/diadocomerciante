import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Container,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
  Alert,
  Box,
} from "@mui/material";


const CadastrarUsuarioEvento = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [distritalId, setDistritalId] = useState("");
  const [limiteParticipantes, setLimiteParticipantes] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [distritais, setDistritais] = useState([]);

  useEffect(() => {
    const fetchDistritais = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/distrital/listar`);
        setDistritais(response.data);
      } catch (error) {
        console.error("Erro ao buscar distritais:", error);
      }
    };
  
    fetchDistritais();
  }, []);
  

  const handleSelectDistrital = (event) => {
    const selectedId = event.target.value;
    setDistritalId(selectedId);

    const selectedDistrital = distritais.find((d) => d.id === selectedId);
    setLimiteParticipantes(selectedDistrital ? selectedDistrital.limite_participantes : "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${process.env.REACT_APP_API_URL}/usuarios/cadastrar`, 
        { nome, email, senha, distrital_id: distritalId, limite_participantes: limiteParticipantes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setMensagem({ text: "Usuário responsável cadastrado com sucesso!", type: "success" });
      setNome("");
      setEmail("");
      setSenha("");
      setDistritalId("");
      setLimiteParticipantes("");
    } catch (error) {
      setMensagem({ text: error.response?.data?.error || "Erro ao cadastrar usuário.", type: "error" });
      console.error(error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>

        </Box>

        <Typography variant="h4" gutterBottom color="primary" align="center">
          Cadastrar Usuário Responsável
        </Typography>

        {mensagem && (
          <Alert severity={mensagem.type} sx={{ mb: 2 }}>
            {mensagem.text}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Nome"
            fullWidth
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Senha"
            type="password"
            fullWidth
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            margin="normal"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Distrital</InputLabel>
            <Select value={distritalId} onChange={handleSelectDistrital}>
              {distritais.map((distrital) => (
                <MenuItem key={distrital.id} value={distrital.id}>
                  {distrital.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Limite de Participantes"
            type="number"
            fullWidth
            value={limiteParticipantes}
            margin="normal"
            disabled
          />

          <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2, py: 1.2 }}>
            Cadastrar Usuário
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default CadastrarUsuarioEvento;

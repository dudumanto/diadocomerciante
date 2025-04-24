import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  Typography,
  Container,
  Paper,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";

const Convite =() => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [distritalId, setDistritalId] = useState("");
  const [distritalNome, setDistritalNome] = useState("Carregando...");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStatus, setModalStatus] = useState("loading"); 
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (!decoded.distrital_id) {
        setDistritalNome("ID da distrital não encontrado no token");
        return;
      }

      setDistritalId(decoded.distrital_id);

      fetch(`http://localhost:5000/api/distrital/${decoded.distrital_id}`)
        .then((res) => res.json())
        .then((data) => setDistritalNome(data.nome || "Nome não encontrado"))
        .catch(() => setDistritalNome("Erro ao carregar nome"));
    } catch (error) {
      console.error("Erro ao decodificar token:", error);
      localStorage.removeItem("token");
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");
    setErro("");
    setModalStatus("loading");
    setModalOpen(true); // Abre o modal

    try {
      const response = await fetch("http://localhost:5000/api/participantes/convidar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ nome, email, distrital_id: distritalId }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensagem("Convite enviado com sucesso!");
        setModalStatus("success");
        setNome("");
        setEmail("");
      } else {
        setErro(data.error || "Erro ao enviar convite.");
        setModalStatus("error");
      }
    } catch (error) {
      console.error("Erro ao enviar convite:", error);
      setErro("Erro ao enviar convite.");
      setModalStatus("error");
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalStatus("");
  };

  return (
    <Container>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h2" gutterBottom color="primary" align="center">
          Cadastro de Convidados
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Nome"
            fullWidth
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            label="E-mail"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            label="Nome da Distrital"
            value={distritalNome}
            fullWidth
            disabled
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, py: 1.2 }}
          >
            Enviar Convite
          </Button>
        </form>
      </Paper>

      {/* Modal / Dialog */}
      <Dialog open={modalOpen} onClose={handleCloseModal}>
        <DialogTitle>
          {modalStatus === "loading" && "Enviando Convite..."}
          {modalStatus === "success" && "Sucesso!"}
          {modalStatus === "error" && "Erro"}
        </DialogTitle>
        <DialogContent dividers>
          {modalStatus === "loading" && (
            <CircularProgress sx={{ display: "block", margin: "0 auto" }} />
          )}
          {modalStatus === "success" && <Typography>{mensagem}</Typography>}
          {modalStatus === "error" && <Typography color="error">{erro}</Typography>}
        </DialogContent>
        {(modalStatus === "success" || modalStatus === "error") && (
          <DialogActions>
            <Button onClick={handleCloseModal} autoFocus>
              Fechar
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </Container>
  );
}

export default Convite;

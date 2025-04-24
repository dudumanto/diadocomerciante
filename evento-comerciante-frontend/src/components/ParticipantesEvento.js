import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Chip,
} from '@mui/material';

const ParticipantesEvento = () => {
  const [participantes, setParticipantes] = useState([]);
  const [distritaisMap, setDistritaisMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setErro('Token não encontrado');
          setLoading(false);
          return;
        }

        const decoded = jwtDecode(token);
        const { role } = decoded;

        const participantesUrl = role === 'admin'
          ? 'http://localhost:5000/api/participantes/listar-todos'
          : 'http://localhost:5000/api/participantes/listar';


        const [participantesRes, distritaisRes] = await Promise.all([
          axios.get(participantesUrl, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/distrital/listar', { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setParticipantes(participantesRes.data);


        const distritalMap = {};
        distritaisRes.data.forEach(d => {
          distritalMap[d.id] = d.nome;
        });

        setDistritaisMap(distritalMap);
      } catch (error) {
        setErro('Erro ao carregar participantes ou distritais');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDados();
  }, []);

  return (
    <Container>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 3, mt: 5 }}>
        <Typography variant="h2" gutterBottom color="primary" align="center" sx={{ fontSize: '2rem' }}>
          Lista de Participantes
        </Typography>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 30 }}>
            <CircularProgress />
          </div>
        ) : erro ? (
          <Alert severity="error" sx={{ mt: 3 }}>{erro}</Alert>
        ) : (
          <TableContainer component={Paper} sx={{ mt: 2 }} elevation={2}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell><strong>Nome</strong></TableCell>
                  <TableCell><strong>E-mail</strong></TableCell>
                  <TableCell><strong>Código Convite</strong></TableCell>
                  <TableCell><strong>Distrital</strong></TableCell>
                  <TableCell><strong>Confirmou Presença</strong></TableCell>
                  <TableCell><strong>Compareceu</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {participantes.map((part) => (
                  <TableRow key={part.id}>
                    <TableCell>{part.nome}</TableCell>
                    <TableCell>{part.email}</TableCell>
                    <TableCell>{part.codigo_convite}</TableCell>
                    <TableCell>{distritaisMap[part.distrital_id] || '—'}</TableCell>
                    <TableCell>
                      <Chip
                        label={part.confirmar_presenca ? 'Sim' : 'Não'}
                        color={part.confirmar_presenca ? 'success' : 'warning'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={part.presenca ? 'Sim' : 'Não'}
                        color={part.presenca ? 'success' : 'default'}
                        variant="outlined"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
};

export default ParticipantesEvento;

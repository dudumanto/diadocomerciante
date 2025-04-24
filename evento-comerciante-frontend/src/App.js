import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Header from "./components/Header";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import { Typography, Box } from "@mui/material";
import CadastrarUsuario from "./components/CadastrarUsuarioEvento";
import RegisterDistrital from "./components/RegisterDistrital";
import { AuthProvider } from "./context/AuthContext"; 
import PrivateRoute from "./components/PrivateRoute"; 
import LeitorQrCode from "./components/LeitorQrCode"; 
import ConfirmacaoConvite from "./components/ConfimacaoConvite"; 
import ParticipanteEvento from "./components/ParticipantesEvento"; 
import Convite from "./components/Convite";


const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider> 
        <Router>
          <Header />
          <Box
            sx={{
              height: "100vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h4" align="center" gutterBottom>
              Gestão de Eventos ACSP
            </Typography>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
                <Route
                  path="/cadastrarusuario"
                  element={
                    <PrivateRoute
                      roles={["admin"]}
                      element={<CadastrarUsuario />}
                    />
                  }
                />
              <Route
                  path="/register-distrital"
                  element={
                    <PrivateRoute
                      roles={["admin"]}
                      element={<RegisterDistrital />}
                    />
                  }
                />
                 <Route path="/aceitar-convite/:codigoConvite" element={<ConfirmacaoConvite />} />
             <Route
                  path="/convite"
                  element={
                    <PrivateRoute
                      roles={["admin", "usuario", "editor"]}
                      element={<Convite />}
                    />
                  }
                />
                <Route
                  path="/listagem"
                  element={
                    <PrivateRoute
                      roles={["admin", "usuario", "editor"]}
                      element={<ParticipanteEvento  />}
                    />
                  }
                />
             <Route
                  path="/leitorqrcode"
                  element={
                    <PrivateRoute
                      roles={["admin", "usuario", "editor"]}
                      element={<LeitorQrCode />}
                    />
                  }
                />
            </Routes>
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;

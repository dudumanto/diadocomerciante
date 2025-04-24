import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import "../styles/Header.css";

const Header = () => {
  const location = useLocation();


  const routesComLogout = [
    "/cadastrarusuario",
    "/convite",
    "/register-distrital"
  ];

  const mostrarLogout = routesComLogout.includes(location.pathname);

  return (
    <AppBar position="static" sx={{ backgroundColor: "#002943" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box display="flex" alignItems="center">
          <Box
            component="img"
            src="/img/logoassociacao.png"
            alt="LIVRO 1"
            sx={{ height: 60, p: 2 }}
          />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Associação
          </Typography>
        </Box>

        {mostrarLogout && <LogoutButton />}
      </Toolbar>
    </AppBar>
  );
};

export default Header;

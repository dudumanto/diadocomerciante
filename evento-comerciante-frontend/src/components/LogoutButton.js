import { useNavigate } from 'react-router-dom';
import { Button } from "@mui/material";

const LogoutButton =() => {
  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem('token');


    navigate('/');
  };

  return (
    <Button sx={{ backgroundColor: 'white' }} onClick={handleLogout}>
      Sair
    </Button>
  );
}

export default LogoutButton;

import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";


const DistritalContext = createContext();


export const DistritalProvider = ({ children }) => {
  const [distritais, setDistritais] = useState([]);


  const fetchDistritais = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/distritais");
      setDistritais(response.data);
    } catch (error) {
      console.error("Erro ao buscar distritais:", error);
    }
  };


  useEffect(() => {
    fetchDistritais();
  }, []);

  return (
    <DistritalContext.Provider value={{ distritais, fetchDistritais }}>
      {children}
    </DistritalContext.Provider>
  );
};


export const useDistrital = () => {
  return useContext(DistritalContext);
};

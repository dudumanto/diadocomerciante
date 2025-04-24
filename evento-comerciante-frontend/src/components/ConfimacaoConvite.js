
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const AceitarConvite =() => {
  const { codigoConvite } = useParams();
  const [status, setStatus] = useState("carregando");
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/participantes/aceitar-convite/${codigoConvite}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setStatus("sucesso");
          setMensagem(data.message);
        } else {
          setStatus("erro");
          setMensagem(data.error || "Erro ao confirmar o convite.");
        }
      })
      .catch(() => {
        setStatus("erro");
        setMensagem("Erro ao conectar com o servidor.");
      });
  }, [codigoConvite]);
  
  return (
    <div style={{ textAlign: "center", padding: "3rem", fontFamily: "sans-serif" }}>
      {status === "carregando" && <p>🔄 Confirmando seu convite...</p>}

      {status === "sucesso" && (
        <>
          <h1>🎉 Convite Confirmado!</h1>
          <p>{mensagem}</p>
          <p>O QR Code foi enviado para seu e-mail.</p>
        </>
      )}

      {status === "erro" && (
        <>
          <h1>❌ Algo deu errado</h1>
          <p>{mensagem}</p>
        </>
      )}
    </div>
  );
}

export default AceitarConvite;

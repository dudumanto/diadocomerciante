import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState, useRef, useCallback } from "react";

const LeitorQrCode =() => {
  const [mensagem, setMensagem] = useState("");
  const [tipo, setTipo] = useState(""); 
  const scannerRef = useRef(null);

  const iniciarScanner = useCallback(() => {
    scannerRef.current = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 }
    });

    const onScanSuccess = (decodedText) => {
      scannerRef.current.clear();

      const codigo = decodedText.split("/").pop();

      fetch(`${process.env.REACT_APP_API_URL}/participantes/confirmar-presenca/${codigo}`)
        .then((res) => res.json())
        .then((data) => {
          setMensagem(data.message || "Presença confirmada!");
          setTipo("success");

          setTimeout(() => {
            setMensagem("");
            setTipo("");
            iniciarScanner();
          }, 3000);
        })
        .catch(() => {
          setMensagem("Erro ao confirmar presença.");
          setTipo("error");

          setTimeout(() => {
            setMensagem("");
            setTipo("");
            iniciarScanner();
          }, 3000);
        });
    };

    const onScanFailure = (error) => {
      console.warn("Erro ao escanear:", error);
    };

    scannerRef.current.render(onScanSuccess, onScanFailure);
  }, []); 

  useEffect(() => {
    iniciarScanner();

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch((err) =>
          console.error("Erro ao limpar scanner:", err)
        );
      }
    };
  }, [iniciarScanner]); 

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Escaneie o QR Code</h2>
      <div id="reader" style={{ margin: "auto", width: "fit-content" }} />

      {mensagem && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            color: tipo === "success" ? "green" : "red",
            fontWeight: "bold"
          }}
        >
          {mensagem}
        </div>
      )}
    </div>
  );
}
export default LeitorQrCode;

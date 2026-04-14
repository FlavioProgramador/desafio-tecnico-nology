import { useState } from "react";
import "./App.css";
import CashbackForm from "./components/CashbackForm";
import TabelaHistorico from "./components/TabelaHistorico";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function App() {
  const [resultadoCashback, setResultadoCashback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  // Gatilho para recarregar o histórico após enviar nova compra
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const handleCalcular = async (dados) => {
    setLoading(true);
    setErro(null);
    setResultadoCashback(null);

    try {
      const response = await fetch(`${API_URL}/api/calcular`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          valor_compra: dados.valorCompra,
          desconto_percentual: dados.desconto,
          is_vip: dados.isVip,
        }),
      });

      if (!response.ok) throw new Error("Erro ao calcular cashback");

      const dadosResposta = await response.json();
      setResultadoCashback(dadosResposta.cashback);

      // Dispara a atualização do componente de Histórico
      setUpdateTrigger((prev) => prev + 1);
    } catch (err) {
      setErro("Falha de conexão com a API. O Backend (Python) está rodando?");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  return (
    <div className="container">
      <h1>💰 Simulador de Cashback Nology</h1>
      <p>
        Descubra quanto você receberá de volta com a nova regra promocional!
      </p>

      <CashbackForm onCalcular={handleCalcular} />

      {/* Exibição de Status / Erros */}
      {loading && (
        <p style={{ marginTop: "20px" }}>⏳ Calculando, aguarde...</p>
      )}
      {erro && (
        <div
          className="alert error"
          style={{ color: "red", marginTop: "15px" }}
        >
          {erro}
        </div>
      )}

      {/* Exibição do Resultado */}
      {resultadoCashback !== null && (
        <div
          className="alert success"
          style={{
            marginTop: "20px",
            padding: "15px",
            backgroundColor: "#e8f5e9",
            borderRadius: "5px",
            border: "1px solid #4CAF50",
            textAlign: "center",
          }}
        >
          <h2 style={{ color: "#2E7D32", margin: 0 }}>
            Você receberá: <br />
            {formatarMoeda(resultadoCashback)}
          </h2>
        </div>
      )}

      {/* Componente de Tabela com o Histórico */}
      <TabelaHistorico updateTrigger={updateTrigger} />
    </div>
  );
}

export default App;

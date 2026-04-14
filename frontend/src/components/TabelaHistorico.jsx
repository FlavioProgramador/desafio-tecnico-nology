import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function TabelaHistorico({ updateTrigger }) {
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const carregarHistorico = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/historico`);
        if (response.ok) {
          const dados = await response.json();
          setHistorico(dados);
        }
      } catch (err) {
        console.error("Erro ao carregar histórico:", err);
      } finally {
        setLoading(false);
      }
    };

    carregarHistorico();
  }, [updateTrigger]); // Re-executa sempre que updateTrigger mudar

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor);
  };

  if (loading && historico.length === 0) {
    return <p>Carregando histórico...</p>;
  }

  return (
    <div
      className="historico-section"
      style={{ marginTop: "30px", textAlign: "left" }}
    >
      <h3>📜 Suas Últimas Consultas (Por IP)</h3>
      {historico.length === 0 ? (
        <p style={{ color: "#666" }}>
          Nenhum cálculo registrado ainda para o seu IP. Faça sua primeira
          simulação!
        </p>
      ) : (
        <table
          className="historico-table"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "10px",
            fontSize: "14px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f1f1f1" }}>
              <th style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                Data/Hora
              </th>
              <th style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                Compra
              </th>
              <th style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                Cliente
              </th>
              <th style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>
                Cashback Salvo
              </th>
            </tr>
          </thead>
          <tbody>
            {historico.map((item, index) => (
              <tr key={index}>
                <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                  {new Date(item.data_consulta).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                  {formatarMoeda(item.valor_compra)}
                </td>
                <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
                  {item.is_vip ? "⭐ VIP" : "Padrão"}
                </td>
                <td
                  style={{
                    padding: "8px",
                    borderBottom: "1px solid #eee",
                    fontWeight: "bold",
                    color: "#2E7D32",
                  }}
                >
                  {formatarMoeda(item.cashback_gerado)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TabelaHistorico;

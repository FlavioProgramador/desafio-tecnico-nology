import { useState } from "react";

function CashbackForm({ onCalcular }) {
  const [valorCompra, setValorCompra] = useState("");
  const [desconto, setDesconto] = useState("");
  const [isVip, setIsVip] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Repassa os dados para o componente pai (App.jsx)
    onCalcular({
      valorCompra: parseFloat(valorCompra),
      desconto: parseFloat(desconto || 0),
      isVip,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="form-card">
      <div className="form-group">
        <label>Valor da Compra (R$ sem desconto)</label>
        <input
          type="number"
          step="0.01"
          min="0.1"
          value={valorCompra}
          onChange={(e) => setValorCompra(e.target.value)}
          required
          placeholder="Ex: 600"
        />
      </div>

      <div className="form-group">
        <label>Cupom de Desconto (%)</label>
        <input
          type="number"
          step="1"
          min="0"
          max="100"
          value={desconto}
          onChange={(e) => setDesconto(e.target.value)}
          placeholder="Ex: 15"
        />
      </div>

      <div className="form-group checkbox-group">
        <label style={{ cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={isVip}
            onChange={(e) => setIsVip(e.target.checked)}
            style={{ marginRight: "8px" }}
          />
          Sou Cliente VIP (10% Bônus) ⭐
        </label>
      </div>

      <button type="submit" className="btn-submit">
        💰 Calcular Cashback
      </button>
    </form>
  );
}

export default CashbackForm;

import "./App.css";
import CashbackForm from "./components/CashbackForm";

function App() {
  const handleCalcular = (dados) => {
    console.log("Dados recebidos do formulário:", dados);
    // No próximo passo, vamos ligar isso à nossa API usando fetch!
  };

  return (
    <div className="container">
      <h1>💰 Simulador de Cashback Nology</h1>
      <p>
        Descubra quanto você receberá de volta com a nova regra promocional!
      </p>

      {/* Componente de Formulário importado da pasta components */}
      <CashbackForm onCalcular={handleCalcular} />
    </div>
  );
}

export default App;

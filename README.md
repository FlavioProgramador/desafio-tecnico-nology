# Simulador de Cashback - Desafio Técnico

Este projeto é a solução para a **Questão 5** do desafio técnico. Trata-se de uma aplicação Full Stack que calcula o valor de cashback baseado em regras de negócio específicas e mantém um histórico de consultas filtrado pelo IP do usuário.

## 🚀 Funcionalidades

- **Cálculo de Cashback**: Aplica dinamicamente as regras (Desconto, Bônus VIP e Promoção em compras acima de R$ 500).
- **Histórico por IP**: Cada simulação é salva no banco de dados e atrelada ao IP de quem fez a consulta.
- **Interface Interativa**: Frontend amigável construído em React para facilitar a entrada de dados e visualização imediata do retorno.

## 🛠️ Tecnologias Utilizadas

**Backend:**

- [Python 3](https://www.python.org/)
- [FastAPI](https://fastapi.tiangolo.com/) (Criação ágil e tipada da API REST)
- [SQLAlchemy](https://www.sqlalchemy.org/) (ORM para comunicação com o banco de dados)
- [PostgreSQL](https://www.postgresql.org/) (Hospedado na nuvem via Neon.tech)

**Frontend:**

- [React](https://react.dev/) (Biblioteca JavaScript para construir interfaces de usuário)
- [Vite](https://vitejs.dev/) (Ferramenta de build rápida e moderna)
- CSS Puro (Responsivo e componentizado)

## 📂 Estrutura do Projeto

O projeto adota a arquitetura de **Monorepo**, dividindo claramente as responsabilidades:

```text
desafio-questao-5/
├── backend/          # API, regras de negócio e conexão com o banco
│   ├── api/          # Rotas e ponto de entrada do FastAPI
│   └── ...           # Dependências (requirements) e variáveis de ambiente
├── frontend/         # Interface do usuário (React/Vite)
│   ├── src/          # Componentes (CashbackForm, TabelaHistorico, App)
│   └── ...           # Configurações do Vite e pacotes Node
└── README.md
```

## ⚙️ Como Rodar o Projeto Localmente

Para testar a aplicação na sua máquina, você precisará abrir **dois terminais**, um para o Back e outro para o Front.

### 1. Rodando o Backend (API)

Abra o primeiro terminal na pasta do projeto e execute:

```bash
# Entre na pasta do backend
cd backend

# Instale as dependências requeridas (recomenda-se criar um ambiente virtual - venv)
python -m pip install -r requirements.txt

# Inicie o servidor
python -m uvicorn api.index:app --reload
```

A API estará rodando em: `http://localhost:8000`

### 2. Rodando o Frontend (Tela)

Abra o segundo terminal e execute:

```bash
# Entre na pasta do frontend
cd frontend

# Instale os pacotes do Node
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

A interface do simulador estará disponível no seu navegador em: `http://localhost:5173` (ou porta similar exibida no terminal).

## 📡 Endpoints da API

- `POST /api/calcular`: Recebe `is_vip`, `valor_compra` e `desconto_percentual`. Calcula o cashback, salva no banco atrelado ao IP e retorna o resultado.
- `GET /api/historico`: Busca todas as simulações anteriores vinculadas ao IP do solicitante (header `x-forwarded-for` ou host do client).

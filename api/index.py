import os
from datetime import datetime
from fastapi import FastAPI, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, Float, Boolean, String, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker, Session

# --- Configuração do Banco de Dados (PostgreSQL) ---
# Em produção (Vercel), a URL virá da variável de ambiente DATABASE_URL.
# Formato do Postgre: "postgresql://usuario:senha@host:5432/nome_do_banco"
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://usuario:senha@localhost:5432/cashback_db")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --- Modelos (Tabelas do Banco) ---
class ConsultaHistorico(Base):
    __tablename__ = "historico_consultas"

    id = Column(Integer, primary_key=True, index=True)
    ip_usuario = Column(String, index=True)
    is_vip = Column(Boolean)
    valor_compra = Column(Float)
    cashback_gerado = Column(Float)
    data_consulta = Column(DateTime, default=datetime.utcnow)

# Tenta criar as tabelas no banco de dados (ignorará se já existirem)
# (Para bancos na nuvem é bom usar uma ferramenta de migração, mas pro desafio assim é ideal)
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Aviso: Não foi possível conectar ao banco de dados ainda. Configure a DATABASE_URL. Erro: {e}")

# --- Configuração do FastAPI ---
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Dependências ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"status": "ok", "mensagem": "API de Cashback conectada ao Postgre!"}

# --- Schemas ---
class CalculoRequest(BaseModel):
    is_vip: bool
    valor_compra: float
    desconto_percentual: float = 0.0

# --- Lógica de Negócio ---
def calcular_cashback(valor_compra: float, desconto_percentual: float, is_vip: bool) -> float:
    valor_final = valor_compra * (1 - desconto_percentual / 100)
    cashback_base = valor_final * 0.05
    cashback_bonus_vip = cashback_base * 0.10 if is_vip else 0.0
    cashback_total = cashback_base + cashback_bonus_vip
    
    if valor_final > 500.0:
        cashback_total *= 2
        
    return round(cashback_total, 2)

# --- Rotas ---
@app.post("/api/calcular")
def calcular(request_data: CalculoRequest, request: Request, db: Session = Depends(get_db)):
    # Identificar IP do usuário (a Vercel envia através do header x-forwarded-for)
    user_ip = request.headers.get("x-forwarded-for", request.client.host)

    # 1. Realiza o cálculo
    cashback = calcular_cashback(
        valor_compra=request_data.valor_compra,
        desconto_percentual=request_data.desconto_percentual,
        is_vip=request_data.is_vip
    )

    # 2. Salva no banco de dados PostgreSQL
    nova_consulta = ConsultaHistorico(
        ip_usuario=user_ip,
        is_vip=request_data.is_vip,
        valor_compra=request_data.valor_compra,
        cashback_gerado=cashback
    )
    db.add(nova_consulta)
    db.commit()

    return {
        "cashback": cashback, 
        "valor_compra": request_data.valor_compra, 
        "is_vip": request_data.is_vip,
        "ip_registrado": user_ip
    }

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Permite que o frontend React acesse a API (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "mensagem": "API Base do Cashback criada com sucesso!"}

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
def calcular(request_data: CalculoRequest):
    cashback = calcular_cashback(
        valor_compra=request_data.valor_compra,
        desconto_percentual=request_data.desconto_percentual,
        is_vip=request_data.is_vip
    )
    return {
        "cashback": cashback, 
        "valor_compra": request_data.valor_compra, 
        "is_vip": request_data.is_vip
    }

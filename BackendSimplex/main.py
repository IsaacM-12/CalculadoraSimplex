from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

# Configuración CORS para permitir solicitudes desde http://localhost:3000
origins = ["http://localhost:3000"]

app = FastAPI()

# Agrega el middleware CORS a tu aplicación FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------------------------------------------------
# Modelos
# ------------------------------------------------------------------------
class VarDesicion(BaseModel):
    variables: list[str]

class Restricciones(BaseModel):
    restricciones: list[str]

# ------------------------------------------------------------------------
# Variables
# ------------------------------------------------------------------------
variableDesicion = VarDesicion(variables=["0", "0", "0"])
varRestricciones = Restricciones(restricciones=["0 cero", "1"])

# ------------------------------------------------------------------------
# Rutas
# ------------------------------------------------------------------------
@app.get("/VarDesicion")
async def GetVarDesicion(request: Request):
    return variableDesicion

@app.post("/VarDesicion")
async def UpdateVarDesicion(varDesicion: VarDesicion):
    global variableDesicion  # Utiliza la declaración global
    variableDesicion = varDesicion
    
    return {"message": "El exitoooo"}



@app.get("/Restricciones")
async def GetRestricciones(request: Request):
    return varRestricciones

@app.post("/Restricciones")
async def UpdateRestricciones(restricciones: Restricciones):
    global varRestricciones  # Utiliza la declaración global
    varRestricciones = restricciones
    
    return {"message": "El exitoooo"}
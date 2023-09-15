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
class VarDecision(BaseModel):
    variables: list[float]

class Restricciones(BaseModel):
    restricciones: list[str]

# ------------------------------------------------------------------------
# Variables
# ------------------------------------------------------------------------
variableDesicion = VarDecision(variables=[0, 0, 0])
varRestricciones = Restricciones(restricciones=["0 cero", "1"])

# ------------------------------------------------------------------------
# Rutas
# ------------------------------------------------------------------------
@app.get("/VarDecision")
async def GetVarDesicion(request: Request):
    return variableDesicion

@app.post("/VarDecision")
async def UpdateVarDesicion(varDecision: VarDecision):
    global variableDesicion  # Utiliza la declaración global
    
    # Hace la suma de la lista que recibe y la guarda al final de una nueva lista
    nueva_lista = AppendSumaAlFinal(varDecision.variables)
    varDecision.variables = nueva_lista
    variableDesicion = varDecision
    
    return {"message": "El exitoooo"}



@app.get("/Restricciones")
async def GetRestricciones(request: Request):
    return varRestricciones

@app.post("/Restricciones")
async def UpdateRestricciones(restricciones: Restricciones):
    global varRestricciones  # Utiliza la declaración global
    varRestricciones = restricciones    
    return {"message": "El exitoooo"}


# ------------------------------------------------------------------------
# Metodos
# ------------------------------------------------------------------------

def AppendSumaAlFinal(l):
    suma = sum(l)  # Usa la función sum para obtener la suma de todos los elementos
    l.append(suma)  # Agrega la suma a la lista

    return l
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
    restricciones: list[list[float]]

class Asignacion(BaseModel):
    numVariables: int
    numRestricciones: int

class Simbolos(BaseModel):
    simbols: list[str]

# ------------------------------------------------------------------------
# Variables
# ------------------------------------------------------------------------
variableDesicion = VarDecision(variables=[0, 0, 0])
varRestricciones = [
    [1.0, 2.0, 3.0],  
    [4.0, 5.0, 6.0],  
    [7.0, 8.0, 9.0],  
]
varSimbolos = []

cantRestricciones = 0
cantVariables = 0

# ------------------------------------------------------------------------
# Rutas
# ------------------------------------------------------------------------
@app.get("/VarDecision")
async def GetVarDesicion(request: Request):
    return variableDesicion

@app.post("/VarDecision")
async def UpdateVarDesicion(varDecision: VarDecision):
    global variableDesicion  # Utiliza la declaración global
    variableDesicion = varDecision.variables
    
    return {"message": "El exitoooo"}



@app.get("/Restricciones")
async def GetRestricciones(request: Request):
    return varRestricciones

@app.post("/Restricciones")
async def UpdateRestricciones(restricciones: Restricciones):
    global varRestricciones  # Utiliza la declaración global
    varRestricciones = restricciones
    
    return {"message": "El exitoooo"}


@app.post("/asignacion")
async def UpdateCantResDes(req: Asignacion):
    global cantRestricciones
    global cantVariables

    cantVariables = req.numVariables
    cantRestricciones = req.numRestricciones

    return {"message": "El exitoooo"}



@app.post("/listSimbolos")
async def UpdateSimbolos(req: Simbolos):
    global varSimbolos
    varSimbolos = req.simbols
    
    
    print(varSimbolos)
    print("num Restricciones ",cantRestricciones)
    print("num Variables ",cantVariables)
    print("Restriccion ",varRestricciones)
    print("Variables ", variableDesicion)

    return {"message": "El exitoooo"}



# ------------------------------------------------------------------------
# Metodos
# ------------------------------------------------------------------------

def AppendSumaAlFinal(l):
    suma = sum(l)  # Usa la función sum para obtener la suma de todos los elementos
    l.append(suma)  # Agrega la suma a la lista

    return l
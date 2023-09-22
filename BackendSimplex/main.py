from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import numpy as np

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

class Simbolos(BaseModel):
    simbols: list[str]

# ------------------------------------------------------------------------
# Variables
# ------------------------------------------------------------------------
matrizGlobal = [
    [1, 2, 3],
    [3, 3, 3],
    [2, 2, 2] 
]

variableDesicion = [
    # 10, 10
    ]
variableRestricciones = [
    # [1, 0, 2],
    # [0, 1, 3],
    # [-1, 1, 2] 
]
varSimbolos = []

# ------------------------------------------------------------------------
# Rutas
# ------------------------------------------------------------------------
@app.get("/matriz")
async def GetMatriz(request: Request):
    global matrizGlobal
    return matrizGlobal

@app.post("/VarDecision")
async def UpdateVarDesicion(req: VarDecision):
    global variableDesicion  # Utiliza la declaración global
    variableDesicion = req.variables
    
    return {"message": "El exitoooo"}



@app.get("/Restricciones")
async def GetRestricciones(request: Request):
    global variableRestricciones
    return variableRestricciones

@app.post("/Restricciones")
async def UpdateRestricciones(req: Restricciones):
    global variableRestricciones  # Utiliza la declaración global
    variableRestricciones = req.restricciones
    
    print(varSimbolos)
    print("Restriccion ",variableRestricciones)
    print("Variables ", variableDesicion)

    matrizTemp = crearMatrizSimplex(variableDesicion, variableRestricciones)
    global matrizGlobal
    matrizGlobal = matrizTemp.tolist()
    print(matrizTemp)

    return {"message": "El exitoooo"}



@app.post("/listSimbolos")
async def UpdateSimbolos(req: Simbolos):
    global varSimbolos
    varSimbolos = req.simbols
    return {"message": "El exitoooo"}



# ------------------------------------------------------------------------
# Metodos
# ------------------------------------------------------------------------

def crearMatrizSimplex(variableDecision, restricciones):
    cantRestricciones = len(restricciones)
    cantVariables = len(variableDecision)

    matriz = np.zeros((cantRestricciones + 1, cantVariables + cantRestricciones + 1))
    
    # Configurar la fila de la función objetivo
    matriz[0, 0:cantVariables] = -np.array(variableDecision)
    matriz[0, -1] = 0  # Z (valor inicial)

    # Configurar las filas de las restricciones
    for i in range(cantRestricciones):
        matriz[i + 1, 0:cantVariables] = np.array(restricciones[i][0:cantVariables])
        matriz[i + 1, cantVariables + i] = 1  # Variable de holgura
        matriz[i + 1, -1] = restricciones[i][-1]

    return matriz

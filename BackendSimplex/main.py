from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from Models import VarDecisionModel, RestriccionesModel, SimbolosModel, ObjetivoFuncionModel
from Simplex import (
    iniciarSimplex,
    set_objetivo_funcion,
    set_simbolos,
    set_restricciones,
    set_variables_decision,
    get_matriz_inicial,
    get_matriz_solucion,
    get_matriz_con_iteraciones
)

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
# Rutas
# ------------------------------------------------------------------------

# Manda la matrizInicial al front para imprimirla


@app.get("/matrizInicial")
async def GetMatrizInicial(request: Request):
    return get_matriz_inicial()

# Manda la matrizConIteraciones al front para imprimirla


@app.get("/matrizConIteraciones")
async def GetMatrizConIteraciones(request: Request):
    return get_matriz_con_iteraciones()

# Manda la matrizSolucion al front para imprimirla


@app.get("/matrizSolucion")
async def GetMatrizSolucion(request: Request):
    return get_matriz_solucion()


# Recibe la lista de variables de decision del front
@app.post("/VarDecision")
async def UpdateVarDesicion(req: VarDecisionModel):
    set_variables_decision(req.variables)
    return {"message": "El exitoooo"}


# Recibe la lista de restricciones del front
@app.post("/Restricciones")
async def UpdateRestricciones(req: RestriccionesModel):
    set_restricciones(req.restricciones)
    iniciarSimplex()

    return {"message": "El exitoooo"}


# Recibe la lista de simbolos seleccionados en el front
@app.post("/listSimbolos")
async def UpdateSimbolos(req: SimbolosModel):
    set_simbolos(req.simbols)
    return {"message": "El exitoooo"}

# Recibe el Objetivo Max Min del front


@app.post("/ObjetivoMaxMin")
async def UpdateObjetivoMaxMin(req: ObjetivoFuncionModel):
    set_objetivo_funcion(req.objetivo)
    return {"message": "El exitoooo"}

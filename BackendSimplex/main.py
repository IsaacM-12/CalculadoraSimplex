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
matrizInicial = []

matrizConIteraciones = [
    # [1, 2, 3],
    # [3, 3, 3],
    # [2, 2, 2] 


  [
    [-1.0, -2.0, 0.0, 0.0, 0.0],
    [1.0, 1.0, 1.0, 0.0, 1.0],
    [1.0, 1.0, 0.0, 1.0, 1.0],
  ],
  [
    [1.0, 0.0, 2.0, 0.0, 2.0],
    [1.0, 1.0, 1.0, 0.0, 1.0],
    [0.0, 0.0, -1.0, 1.0, 0.0],
  ],
  [
    [1.0, 0.0, 2.0, 0.0, 2.0],
    [1.0, 1.0, 1.0, 0.0, 1.0],
    [0.0, 0.0, -1.0, 1.0, 0.0],
  ]
]

variableDesicion = [
    # 2 , 3
    ]
variableRestricciones = [
    # [2, 1, 4],
    # [1, 2, 5]
]
varSimbolos = []

# ------------------------------------------------------------------------
# Rutas
# ------------------------------------------------------------------------
# Manda la matrizInicial al front para imprimirla 
@app.get("/matrizInicial")
async def GetMatriz(request: Request):
    global matrizInicial
    return matrizInicial



# Manda la matrizFinal al front para imprimirla 
@app.get("/matrizFinal")
async def GetMatriz(request: Request):
    global matrizConIteraciones
    return matrizConIteraciones



# Recibe la lista de variables de decision del front
@app.post("/VarDecision")
async def UpdateVarDesicion(req: VarDecision):
    global variableDesicion  # Utiliza la declaración global
    variableDesicion = req.variables
    
    return {"message": "El exitoooo"}



@app.get("/Restricciones")
async def GetRestricciones(request: Request):
    global variableRestricciones
    return variableRestricciones

# Recibe la lista de restricciones del front
@app.post("/Restricciones")
async def UpdateRestricciones(req: Restricciones):
    global variableRestricciones  # Utiliza la declaración global
    variableRestricciones = req.restricciones
    
    # print(varSimbolos)
    # print("Restriccion ",variableRestricciones)
    # print("Variables ", variableDesicion)

    iniciaSimplex()

    return {"message": "El exitoooo"}


# Recibe la lista de simbolos seleccionados en el front
@app.post("/listSimbolos")
async def UpdateSimbolos(req: Simbolos):
    global varSimbolos
    varSimbolos = req.simbols
    return {"message": "El exitoooo"}


# ------------------------------------------------------------------------
# Metodos
# ------------------------------------------------------------------------

#Inicia el simplex Crea la matriz y hace las iteraciones 
def iniciaSimplex():
    matrizTemp = crearMatrizSimplex(variableDesicion, variableRestricciones)
    
    matrizTempInicial = matrizTemp.tolist()

    # Crea un titulo para la matriz inicial
    titulo = tituloMatriz(len(variableDesicion), len(variableRestricciones) )
    matrizTempInicial.insert(0, titulo)

    # Asigna la matriz con el titulo a la matriz inicial
    global matrizInicial
    matrizInicial = matrizTempInicial

    # Hace el algoritmo del simplex con las iteraciones y la guarda en matrizConIteraciones
    matrizSimplex = simplex_algorithm(matrizTemp)
    global matrizConIteraciones
    matrizConIteraciones = matrizSimplex
    



# Recibe una lista con variable Decision y una matriz de restricciones 
# Devuelve la matriz Simplex correspondiente
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

# Recibe una matriz lista para comenzar a iterar con el metodo simplex
# Devuelve la matriz con la solucion optima 
def simplex_algorithm(tabulacionSimplex):
    tabulacionSimplex = tabulacionSimplex.astype(np.float64)  # Convertir la matriz a float64
    iteration = 1
    MatrizConLasIteraciones = []

    while True:
        # Guarda la matriz en cada iteración
        MatrizConLasIteraciones.append(tabulacionSimplex.tolist())

        # Encuentra la columna de entrada (variable a entrar) con el coeficiente más negativo en la fila Z
        column_to_enter = np.argmin(tabulacionSimplex[0, :-1])

        # Verifica si todos los coeficientes en la columna de entrada son no positivos (criterio de parada)
        if tabulacionSimplex[0, column_to_enter] >= 0:
            break

        # Encuentra la fila de salida (variable a salir) usando la regla del cociente mínimo
        ratios = tabulacionSimplex[1:, -1] / tabulacionSimplex[1:, column_to_enter]
        row_to_exit = np.argmin(ratios) + 1  # Se suma 1 para tener en cuenta la fila de costos

        # Realiza el pivoteo para llevar la variable de salida a la columna de entrada
        pivot_element = tabulacionSimplex[row_to_exit, column_to_enter]
        tabulacionSimplex[row_to_exit, :] /= pivot_element

        # Realiza operaciones de fila para hacer ceros en la columna de entrada en otras filas
        for i in range(len(tabulacionSimplex)):
            if i != row_to_exit:
                multiplier = -tabulacionSimplex[i, column_to_enter]
                tabulacionSimplex[i, :] += multiplier * tabulacionSimplex[row_to_exit, :]

        iteration += 1

    return MatrizConLasIteraciones

#recibe un x que es la cantidad de variables s que es la cantidad de restricciones 
# devuelve una lista con la cantidad de x y s indicadas y Un String Solucion al final
def tituloMatriz(x, s):
    lista_resultado = []

    for i in range(1, x + 1):
        lista_resultado.append(f'X{i}')

    for i in range(1, s + 1):
        lista_resultado.append(f'S{i}')

    lista_resultado.append("Solucion")

    return lista_resultado
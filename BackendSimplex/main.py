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


class ObjetivoFuncion(BaseModel):
    objetivo: str


# ------------------------------------------------------------------------
# Variables
# ------------------------------------------------------------------------
matrizSolucion = []


matrizInicial = [
    # [1, 2, 3],
    # [3, 3, 3],
    # [2, 2, 2]
]

matrizConIteraciones = [

    #   [
    #     [-1.0, -2.0, 0.0, 0.0, 0.0],
    #     [1.0, 1.0, 1.0, 0.0, 1.0],
    #     [1.0, 1.0, 0.0, 1.0, 1.0],
    #   ],
    #   [
    #     [1.0, 0.0, 2.0, 0.0, 2.0],
    #     [1.0, 1.0, 1.0, 0.0, 1.0],
    #     [0.0, 0.0, -1.0, 1.0, 0.0],
    #   ],
    #   [
    #     [1.0, 0.0, 2.0, 0.0, 2.0],
    #     [1.0, 1.0, 1.0, 0.0, 1.0],
    #     [0.0, 0.0, -1.0, 1.0, 0.0],
    #   ]
]

variableDesicion = [
    # 2 , 3
]
variableRestricciones = [
    # [2, 1, 4],
    # [1, 2, 5]
]
varSimbolos = []

ObjetivoMaxMin = ""

# ------------------------------------------------------------------------
# Rutas
# ------------------------------------------------------------------------

# Manda la matrizInicial al front para imprimirla


@app.get("/matrizInicial")
async def GetMatrizInicial(request: Request):
    global matrizInicial
    return matrizInicial


# Manda la matrizConIteraciones al front para imprimirla
@app.get("/matrizConIteraciones")
async def GetMatrizConIteraciones(request: Request):
    global matrizConIteraciones
    return matrizConIteraciones


# Manda la matrizSolucion al front para imprimirla
@app.get("/matrizSolucion")
async def GetMatrizSolucion(request: Request):
    global matrizSolucion
    return matrizSolucion


# Recibe la lista de variables de decision del front
@app.post("/VarDecision")
async def UpdateVarDesicion(req: VarDecision):
    global variableDesicion  # Utiliza la declaración global
    variableDesicion = req.variables
    return {"message": "El exitoooo"}


# Recibe la lista de restricciones del front
@app.post("/Restricciones")
async def UpdateRestricciones(req: Restricciones):
    global variableRestricciones  # Utiliza la declaración global
    variableRestricciones = req.restricciones

    iniciaSimplex()

    return {"message": "El exitoooo"}


# Recibe la lista de simbolos seleccionados en el front
@app.post("/listSimbolos")
async def UpdateSimbolos(req: Simbolos):
    global varSimbolos
    varSimbolos = req.simbols
    return {"message": "El exitoooo"}

# Recibe el Objetivo Max Min del front


@app.post("/ObjetivoMaxMin")
async def UpdateObjetivoMaxMin(req: ObjetivoFuncion):
    global ObjetivoMaxMin  # Utiliza la declaración global
    ObjetivoMaxMin = req.objetivo
    return {"message": "El exitoooo"}


# ------------------------------------------------------------------------
# Metodos
# ------------------------------------------------------------------------

# Inicia el simplex Crea la matriz y hace las iteraciones
def iniciaSimplex():
    matrizTemp = crearMatrizSimplex(variableDesicion, variableRestricciones)

    # Pasa la matriz a lista para asiganrla a la inicial
    matrizList = matrizTemp.tolist()
    # Crea un titulo para la matriz inicial
    titulo = tituloMatriz(len(variableDesicion), len(variableRestricciones))
    matrizList.insert(0, titulo)
    # Asigna la matriz con el titulo a la matriz inicial
    global matrizInicial
    matrizInicial = matrizList

    # Hace el algoritmo del simplex con las iteraciones y la guarda en matrizConIteraciones
    # ademas guarda la solucion
    simplex_algorithm(matrizTemp)


# Recibe una lista con variable Decision y una matriz de restricciones
# Devuelve la matriz Simplex correspondiente
def crearMatrizSimplex(variableDecision, restricciones):
    cantRestricciones = len(restricciones)
    cantVariables = len(variableDecision)

    matriz = np.zeros(
        (cantRestricciones + 1, cantVariables + cantRestricciones + 1))

    # Configurar la fila de la función objetivo
    matriz[0, 0:cantVariables] = -np.array(variableDecision)
    matriz[0, -1] = 0  # Z (valor inicial)

    # Configurar las filas de las restricciones
    for i in range(cantRestricciones):
        matriz[i + 1,
               0:cantVariables] = np.array(restricciones[i][0:cantVariables])
        matriz[i + 1, cantVariables + i] = 1  # Variable de holgura
        matriz[i + 1, -1] = restricciones[i][-1]

    return matriz


# Recibe una matriz lista para comenzar a iterar con el metodo simplex
# Devuelve la matriz con la solucion optima
def simplex_algorithm(tabulacionSimplex):
    tabulacionSimplex = tabulacionSimplex.astype(
        np.float64)  # Convertir la matriz a float64
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
        ratios = tabulacionSimplex[1:, -1] / \
            tabulacionSimplex[1:, column_to_enter]
        # Se suma 1 para tener en cuenta la fila de costos
        row_to_exit = np.argmin(ratios) + 1

        # Realiza el pivoteo para llevar la variable de salida a la columna de entrada
        pivot_element = tabulacionSimplex[row_to_exit, column_to_enter]
        tabulacionSimplex[row_to_exit, :] /= pivot_element

        # Realiza operaciones de fila para hacer ceros en la columna de entrada en otras filas
        for i in range(len(tabulacionSimplex)):
            if i != row_to_exit:
                multiplier = -tabulacionSimplex[i, column_to_enter]
                tabulacionSimplex[i, :] += multiplier * \
                    tabulacionSimplex[row_to_exit, :]

        iteration += 1

    # Guarda la matriz solucion
    global matrizSolucion
    matrizSolucion = tabulacionSimplex.tolist()

    # Le agrega el titulo a la Solucion
    titulo = tituloMatriz(len(variableDesicion), len(variableRestricciones))
    matrizSolucion.insert(0, titulo)

    # Guarda la matriz con las iteraciones
    global matrizConIteraciones
    matrizConIteraciones = MatrizConLasIteraciones

    return


# Recibe un x que es la cantidad de variables s que es la cantidad de restricciones
# Devuelve una lista con la cantidad de x y s indicadas y Un String Solucion al final
def tituloMatriz(x, s):
    lista_resultado = []

    for i in range(1, x + 1):
        lista_resultado.append(f'X{i}')

    for i in range(1, s + 1):
        lista_resultado.append(f'S{i}')

    lista_resultado.append("Solución")

    return lista_resultado

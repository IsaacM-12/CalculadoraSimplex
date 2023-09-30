# Recibe variables Decision, restricciones, los Simbolos, Objetivo (Max Min)
# Devuelve una matriz para iniciar gran M o simplex segun corresponda
import numpy as np

# ------------------------------------------------------------------------
# Variables
# ------------------------------------------------------------------------
matrizSolucionGlobal = []

matrizInicialGlobal = []

matrizConIteracionesGlobal = []

variablesDeDesicionGlobal = []

restriccionesGlobal = []

simbolosGlobal = []

objetivoFuncion = ""

# Valor de M (un número muy grande)
M = 1000000

# ------------------------------------------------------------------------
# Geters y setters
# ------------------------------------------------------------------------


def set_matriz_solucion(matriz):
    global matrizSolucionGlobal
    matrizSolucionGlobal = matriz


def set_matriz_inicial(matriz):
    global matrizInicialGlobal
    matrizInicialGlobal = matriz


def set_matriz_con_iteraciones(matriz):
    global matrizConIteracionesGlobal
    matrizConIteracionesGlobal = matriz


def set_variables_decision(variables):
    global variablesDeDesicionGlobal
    variablesDeDesicionGlobal = variables


def set_restricciones(restricciones):
    global restriccionesGlobal
    restriccionesGlobal = restricciones


def set_simbolos(simbolos):
    global simbolosGlobal
    simbolosGlobal = simbolos


def set_objetivo_funcion(objetivo):
    global objetivoFuncion
    objetivoFuncion = objetivo


def get_matriz_solucion():
    global matrizSolucionGlobal
    return matrizSolucionGlobal


def get_matriz_inicial():
    global matrizInicialGlobal
    return matrizInicialGlobal


def get_matriz_con_iteraciones():
    global matrizConIteracionesGlobal
    return matrizConIteracionesGlobal


def get_variables_decision():
    global variablesDeDesicionGlobal
    return variablesDeDesicionGlobal


def get_restricciones():
    global restriccionesGlobal
    return restriccionesGlobal


def get_simbolos():
    global simbolosGlobal
    return simbolosGlobal


def get_objetivo_funcion():
    global objetivoFuncion
    return objetivoFuncion


# ------------------------------------------------------------------------
# Metodos
# ------------------------------------------------------------------------

# Recibe variables Decision, restricciones, los Simbolos, Objetivo (Max Min)
# Devuelve una matriz para iniciar gran M o simplex segun corresponda
def crearMatrizSimplex(variableDecision, restricciones, varSimbolos, ObjetivoMaxMin):
    cantRestricciones = len(restriccionesGlobal)
    cantVariables = len(variablesDeDesicionGlobal)
    cantMayorIgual = sum(1 for simbolo in simbolosGlobal if simbolo == ">=")
    cantIgual = sum(1 for simbolo in simbolosGlobal if simbolo == "=")

    matriz = np.zeros((cantRestricciones + 1, cantVariables +
                       cantRestricciones + cantMayorIgual + 1))

    # Configurar la fila de la función objetivo
    if ObjetivoMaxMin == "Minimizar":
        matriz[0, 0:cantVariables] = np.array(variableDecision)
    else:
        matriz[0, 0:cantVariables] = -np.array(variableDecision)

    # Variable para llevar una cuenta de las M puestas
    Mpuestas = 0
    # Lleva la cuenta de cuando se mueve en la lista de varSimbolos
    cuentaDeSimbolosTemp = 0
    simboloIgualRecorridos = 0

    # Configurar las filas de las restricciones
    for i in range(cantRestricciones):
        matriz[i + 1,
               0:cantVariables] = np.array(restricciones[i][0:cantVariables])
        matriz[i + 1, -1] = np.array(restricciones[i][-1])

        # Agregar variables de holgura o artificiales según los símbolos
        if varSimbolos[cuentaDeSimbolosTemp] == '<=':
            # Variable de holgura positiva
            matriz[i + 1, cantVariables + i] = 1

        elif varSimbolos[cuentaDeSimbolosTemp] == '>=':
            # Variable de holgura negativa
            matriz[i + 1, cantVariables + i] = -1

            # Agregar una variable artificial
            Mpuestas += 1
            matriz[i + 1, cantVariables + cantRestricciones -
                   simboloIgualRecorridos + Mpuestas - 1] = 1

        elif varSimbolos[cuentaDeSimbolosTemp] == '=':
            simboloIgualRecorridos += 1
            # Agregar una variable artificial
            Mpuestas += 1
            matriz[i + 1, cantVariables + cantRestricciones -
                   simboloIgualRecorridos + Mpuestas - 1] = 1

        cuentaDeSimbolosTemp += 1

    # Agrega Las M en la primera Fila(Z)
    M_en_Z = cantVariables + cantRestricciones - cantIgual
    matriz[0, M_en_Z:-1] = M

    return matriz


# Recibe una matriz para hacer simplex
# Devuelve la matriz con el simplex hecho


def simplex_algorithm_with_M(tableau):
    tableau = tableau.astype(np.float64)  # Convertir la matriz a float64
    iteration = 1
    titulo = tituloMatriz()
    global matrizConIteracionesGlobal

    iteraciones = []
    while True:
        # Agrega las iteraciones a la variable iteraciones
        tableauList = tableau.tolist()
        tableauList.insert(0, titulo)

        iteraciones.append(tableauList)

        # Encuentra la columna de entrada (variable a entrar) con el coeficiente más negativo en la fila Z
        column_to_enter = np.argmin(tableau[0, :-1])

        # Verifica si todos los coeficientes en la columna de entrada son no positivos (criterio de parada)
        if tableau[0, column_to_enter] >= 0:
            break

        # Encuentra la fila de salida (variable a salir) usando la regla del cociente mínimo
        ratios = tableau[1:, -1] / np.where(
            tableau[1:, column_to_enter] != 0, tableau[1:, column_to_enter], np.inf)

        # Verifica si todos los ratios son negativos o cero
        if all(ratio <= 0 for ratio in ratios):
            print("El problema no tiene solución óptima o es no acotado.")
            matrizConIteracionesGlobal = iteraciones
            return tableau  # Terminar la ejecución

        # Encuentra la fila de salida evitando divisiones por cero
        valid_ratios = []
        for i in range(len(ratios)):
            if tableau[i + 1, column_to_enter] > 0:
                valid_ratios.append(ratios[i])
            else:
                valid_ratios.append(np.inf)

        # Se suma 1 para tener en cuenta la fila de costos
        row_to_exit = np.argmin(valid_ratios) + 1

        # Realiza el pivoteo para llevar la variable de salida a la columna de entrada
        pivot_element = tableau[row_to_exit, column_to_enter]
        tableau[row_to_exit, :] /= pivot_element

        # Realiza operaciones de fila para hacer ceros en la columna de entrada en otras filas
        for i in range(len(tableau)):
            if i != row_to_exit:
                multiplier = -tableau[i, column_to_enter]
                tableau[i, :] += multiplier * tableau[row_to_exit, :]

        iteration += 1

    matrizConIteracionesGlobal = iteraciones

    return tableau


# Recibe 2 listas
# Devuelve la primera lista restada con la segunda


def restar_listas(lista1, lista2):
    if len(lista1) != len(lista2):
        raise ValueError(
            "Las listas deben tener la misma longitud para la multiplicación elemento por elemento.")

    resultado = [a - b for a, b in zip(lista1, lista2)]
    return resultado


# Recibe una lista y un numero
# Devuelve lista multiplicada por ese numero


def multiplicar_lista_por_numero(lista, numero):
    array_lista = np.array(lista)
    resultado = array_lista * numero
    return resultado.tolist()


# Recibe una matriz inicial de la gran M
# Devuelve la matriz lista para hacer simplex


def pasar_A_Simplex(Matriz):
    for j in range(len(simbolosGlobal)):
        if simbolosGlobal[j] != "<=":
            restriccion_Por_M = multiplicar_lista_por_numero(Matriz[j + 1], M)
            Matriz[0] = restar_listas(Matriz[0], restriccion_Por_M)

    return Matriz


# Devuelve una lista con la cantidad de x, y, s indicadas y Un String Solucion al final


def tituloMatriz():
    cantRestricciones = len(restriccionesGlobal)
    cantVariables = len(variablesDeDesicionGlobal)
    cantMayorIgual = sum(1 for simbolo in simbolosGlobal if simbolo == ">=")
    cantIgual = sum(1 for simbolo in simbolosGlobal if simbolo == "=")

    lista_resultado = []

    for i in range(1, cantVariables + 1):
        lista_resultado.append(f'X{i}')

    for i in range(1, cantRestricciones - cantIgual + 1):
        lista_resultado.append(f'S{i}')

    for i in range(1, cantMayorIgual + cantIgual + 1):
        lista_resultado.append(f'R{i}')

    lista_resultado.append("Solución")

    return lista_resultado


# Realiza el proceso necesario para hacer el simplex


def iniciarSimplex():
    tableau = crearMatrizSimplex(
        variablesDeDesicionGlobal, restriccionesGlobal, simbolosGlobal, objetivoFuncion)
    primeraMatriz = tableau.tolist()

    # Agrega la primera matriz que se crea a la variable global matrizInicialGlobal
    titulo = tituloMatriz()
    primeraMatriz.insert(0, titulo)
    global matrizInicialGlobal
    matrizInicialGlobal = primeraMatriz

    lisParaSimplex = pasar_A_Simplex(tableau)

    resultado = simplex_algorithm_with_M(lisParaSimplex)
    resultado[0][-1] = abs(resultado[0][-1])
    resultadotoList = resultado.tolist()

    # Agrega la solucion a la variable global matrizSolucionGlobal
    resultadotoList.insert(0, titulo)
    global matrizSolucionGlobal
    matrizSolucionGlobal = resultadotoList

    return resultadotoList

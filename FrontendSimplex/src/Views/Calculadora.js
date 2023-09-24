import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";

const Calculadora = () => {
  // Definición de estados iniciales usando useState
  const [showMatrizShow, setMatrizShow] = useState([]); // Guarda lo que se digite en la matriz Restricciones y Variables de decision

  const [numVariables, setNumVariables] = useState(1); // Número de variables de decisión
  const [numRestricciones, setNumRestricciones] = useState(1); // Número de restricciones

  const [variablesDeDecisionInput, setVariablesDeDecisionInput] = useState([]); // Arreglo para almacenar las entradas de variables de decisión
  const [restriccionesInput, setRestriccionesInput] = useState([]); // Arreglo para almacenar las entradas de restricciones

  const [variablesDesGuardar, setVariablesDesGuardar] = useState([]); // Arreglo para guardar las variables de decisión ingresadas
  const [RestriccionesGuardar, setRestriccionesGuardar] = useState([]); // Arreglo para guardar las restricciones ingresadas
  const [simbolosGuardar, setSimbolosGuardar] = useState([]); // Arreglo para guardar los select de las restricciones
  const [objetivoMaxMinGuardar, setObjetivoMaxMinGuardar] = useState(null); // Arreglo para guardar el objetivo de la funcion

  // Función para manejar el cambio en el select
  const handleSelectObjetivoChange = (event) => {
    const selectedOption = event.target.value;
    setObjetivoMaxMinGuardar(selectedOption);
  };

  // -------------------------------------------------------------
  // Se ejecuta cada vez que se recarga la pagina
  // -------------------------------------------------------------
  useEffect(() => {
    // Obtenemos la cadena de consulta de la URL
    const queryString = window.location.search;
    // Creamos un objeto URLSearchParams para analizar la cadena de consulta
    const params = new URLSearchParams(queryString);
    // Obtenemos el valor de numVariables y numRestricciones
    const numVariablesReq = parseInt(params.get("numVariables"), 10); // 10 es la base para parsear números
    const numRestriccionesReq = parseInt(params.get("numRestricciones"), 10);
    //asigna a unas variables globales para poder usarlas de manera global
    setNumVariables(numVariablesReq);
    setNumRestricciones(numRestriccionesReq);

    generateVariableInputs(numVariablesReq, numRestriccionesReq);
    selectMatriz();
  }, []); // El segundo argumento vacío asegura que se llame solo una vez al cargar la página

  // -------------------------------------------------------------
  // redirige a la ruta  /matrizLista
  // -------------------------------------------------------------
  const redirectToMatrizLista = () => {
    const nuevaURL = `/matrizLista`;
    window.location.href = nuevaURL;
  };

  // -------------------------------------------------------------
  // recibe un Array y lo combierte en tabla
  // -------------------------------------------------------------
  function crearTablaDesdeArray(matriz) {
    if (
      !Array.isArray(matriz) ||
      matriz.length === 0 ||
      !Array.isArray(matriz[0]) ||
      matriz[0].length === 0
    ) {
      return <p>Aqui aparecera la matriz.</p>;
    }

    const filas = matriz.map((fila, i) => (
      <tr key={i}>
        {fila.map((valor, j) => (
          <td key={j}>{valor}</td>
        ))}
      </tr>
    ));

    return (
      <div class="container">
        <table class="table table-striped table-dark">
          <tbody>{filas}</tbody>
        </table>

        <button className="btn btn-primary" onClick={redirectToMatrizLista}>
          Continuar
        </button>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Función para generar dinámicamente las entradas de variables y restricciones
  // -------------------------------------------------------------
  const generateVariableInputs = (numVarsEntrada, numRestEntrada) => {
    const variableInputs = [];
    const restriccionInputs = [];
    const variablesDesGuardarArray = [];
    const restriccionesArray = [];
    const selectArray = [];

    // Generar entradas para variables de decisión
    for (let i = 1; i <= numVarsEntrada; i++) {
      const variableName = `Variable X${i}`;
      variableInputs.push(
        <div key={`var_${i}`}>
          {variableName}:
          <input
            className="VarDesInput"
            type="number"
            required
            onChange={(e) => {
              variablesDesGuardarArray[i - 1] = e.target.value;
              setVariablesDesGuardar([...variablesDesGuardarArray]);
            }}
          />
        </div>
      );
    }

    // Generar entradas para restricciones
    for (let i = 1; i <= numRestEntrada; i++) {
      const restriccionRow = [];
      for (let j = 1; j <= numVarsEntrada + 1; j++) {
        restriccionRow.push(
          <input
            key={`restr_${i}_var_${j}`}
            className="VarResInput"
            required
            type="number"
            onChange={(e) => {
              if (!restriccionesArray[i - 1]) {
                restriccionesArray[i - 1] = [];
              }
              restriccionesArray[i - 1][j - 1] = e.target.value;
              setRestriccionesGuardar([...restriccionesArray]);
            }}
          />
        );

        if (j === numVarsEntrada) {
          restriccionRow.push(
            <select
              required
              onChange={(e) => {
                if (!selectArray[i - 1]) {
                  selectArray[i - 1] = [];
                }
                selectArray[i - 1] = e.target.value;
                setSimbolosGuardar([...selectArray]);
              }}
            >
              <option value="">Seleccionar una opción</option>
              <option value=">=">&#8805; (Mayor o igual que)</option>
              <option value="<=">&#8804; (Menor o igual que)</option>
              <option value="=">= (Igual a)</option>
            </select>
          );
        }
      }
      restriccionInputs.push(
        <div key={`restr_${i}`}>
          Restricción {i}:{restriccionRow}
        </div>
      );
    }

    // Actualizar los estados con las entradas generadas para crear los input requeridos
    setVariablesDeDecisionInput(variableInputs);
    setRestriccionesInput(restriccionInputs);
    setSimbolosGuardar(selectArray);
  };

  // -------------------------------------------------------------
  // crea la lista de simbolos (API)
  // -------------------------------------------------------------
  const createListaSimbolos = async () => {
    var newVariable = {
      simbols: simbolosGuardar,
    };
    if (numRestricciones !== newVariable.simbols.length) {
      alert("Debe seleccionar todos los simbolos <=, = o >=.");
      return;
    } else {
      const serviceUrl = `http://localhost:8000/listSimbolos `;
      let config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      axios
        .post(serviceUrl, newVariable, config)
        .then((response) => {
          objetivoFuncionMaxMin();
        })
        .catch((error) => {
          console.error("Error en la solicitud:", error);
        });
    }
  };

  // -------------------------------------------------------------
  // Seleccionar Objetivo de la funcion Maximizar o Minimizar (API)
  // -------------------------------------------------------------
  const objetivoFuncionMaxMin = async () => {
    var newVariable = {
      objetivo: objetivoMaxMinGuardar,
    };
    if (objetivoMaxMinGuardar === null) {
      alert("Debe ingresar el objetivo Maximizar o Minimizar");
      return;
    } else {
      const serviceUrl = `http://localhost:8000/ObjetivoMaxMin `;
      let config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      axios
        .post(serviceUrl, newVariable, config)
        .then((response) => {
          createVariableDecision();
        })
        .catch((error) => {
          console.error("Error en la solicitud:", error);
        });
    }
  };

  // -------------------------------------------------------------
  // crea las variables de desicion (API)
  // -------------------------------------------------------------
  const createVariableDecision = async () => {
    var newVariable = {
      variables: variablesDesGuardar,
    };

    if (newVariable.variables.length !== numVariables) {
      alert("Debe digitar todas las variables de decision.");
      return;
    } else {
      const serviceUrl = `http://localhost:8000/VarDecision`;
      let config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      axios
        .post(serviceUrl, newVariable, config)
        .then((response) => {
          createRestricciones();
        })
        .catch((error) => {
          console.error("Error en la solicitud:", error);
        });
    }
  };

  // -------------------------------------------------------------
  // crea las Restricciones (API)
  // -------------------------------------------------------------
  const createRestricciones = async () => {
    var newVariable = {
      restricciones: RestriccionesGuardar,
    };

    if (newVariable.restricciones.length !== numRestricciones) {
      alert("Debe digitar todas las restricciones.");
      return;
    } else {
      const serviceUrl = `http://localhost:8000/Restricciones `;
      let config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      axios
        .post(serviceUrl, newVariable, config)
        .then((response) => {
          selectMatriz();
          alert("Matriz creada con exito");
        })
        .catch((error) => {
          console.error("Error en la solicitud:", error);
        });
    }
  };

  // -------------------------------------------------------------
  // seleciona la matriz del api (API)
  // -------------------------------------------------------------
  const selectMatriz = async () => {
    const serviceUrl = "http://localhost:8000/matrizInicial";
    try {
      const response = await axios.get(serviceUrl);

      const variablesString = response.data;
      const table = crearTablaDesdeArray(variablesString);

      // Actualiza el estado con los datos de VarDesicion
      setMatrizShow(table);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // -------------------------------------------------------------
  // Llama a los metodos necesarios para crear la matriz en el api (API)
  // -------------------------------------------------------------
  const crearMatrizAPI = async () => {
    createListaSimbolos();
  };

  // Renderizar la interfaz de usuario
  return (
    <div className="container">
      <div>
        <div className="titulo">
          <h1>Calculadora</h1>
        </div>
        <h3>Entradas para Variables de Decisión:</h3>
        {variablesDeDecisionInput}
      </div>

      <div>
        <label>Selecciona el objetivo:</label>
        <select
          id="objetivoSelect"
          onChange={handleSelectObjetivoChange}
        >
          <option value="">Selecciona una opción</option>
          <option value="Maximizar">Maximizar</option>
          <option value="Minimizar">Minimizar</option>
        </select>
      </div>

      <div>
        <h3>Entradas para Restricciones:</h3>
        {restriccionesInput}
      </div>
      <div className="space">
        <button
          className="btn btn-primary"
          type="button"
          onClick={crearMatrizAPI}
        >
          Crear{" "}
        </button>
      </div>
      <h3>Matriz</h3>
      {showMatrizShow}
    </div>
  );
};
export default Calculadora;

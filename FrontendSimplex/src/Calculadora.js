import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";

const Calculadora = () => {
  const [showVarDesicion, setshowVarDesicion] = useState([]);
  const [showRestricciones, setshowRestricciones] = useState([]);

  // Definición de estados iniciales usando useState
  const [numVariables, setNumVariables] = useState(2); // Número de variables de decisión
  const [numRestricciones, setNumRestricciones] = useState(2); // Número de restricciones

  const [variablesDeDecision, setVariablesDeDecision] = useState([]); // Arreglo para almacenar las entradas de variables de decisión
  const [restricciones, setRestricciones] = useState([]); // Arreglo para almacenar las entradas de restricciones

  const [variablesDesGuardar, setVariablesDesGuardar] = useState([]); // Arreglo para guardar las variables de decisión ingresadas
  const [Restricciones, setRestriccionesGuardar] = useState([]); // Arreglo para guardar las restricciones ingresadas
  const [selectGuardar, setSelectGuardar] = useState([]); // Arreglo para guardar los select de las restricciones

  // Función para generar dinámicamente las entradas de variables y restricciones
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
                setSelectGuardar([...selectArray]);
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

    // Actualizar los estados con las entradas generadas
    setVariablesDeDecision(variableInputs);
    setRestricciones(restriccionInputs);
    setSelectGuardar(selectArray);
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

      axios.post(serviceUrl, newVariable, config); //then es usando promises, se puede asignar a una variable si quiere sin promises
    }
  };

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
  // seleciona la matriz (API)
  // -------------------------------------------------------------
  const selectMatriz = async () => {
    const serviceUrl = "http://localhost:8000/matriz";
    try {
      const response = await axios.get(serviceUrl);

      const variablesString = response.data;
      const table = crearTablaDesdeArray(variablesString);

      // Actualiza el estado con los datos de VarDesicion
      setshowVarDesicion(table);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // -------------------------------------------------------------
  // crea las Restricciones (API)
  // -------------------------------------------------------------
  const createRestricciones = async () => {
    var newVariable = {
      restricciones: Restricciones,
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
        .post(serviceUrl, newVariable, config) //then es usando promises, se puede asignar a una variable si quiere sin promises
        .then((response) => {
          alert("Creado con exito");
          selectRestricciones();
          selectMatriz();
        });
    }
  };

  // -------------------------------------------------------------
  // seleciona las Restricciones (API)
  // -------------------------------------------------------------
  const selectRestricciones = async () => {
    const serviceUrl = "http://localhost:8000/Restricciones";
    try {
      const response = await axios.get(serviceUrl);
      // Convierte el arreglo en una cadena separada por comas y luego imprímelo
      const variablesString = " [ " + response.data.join(", ") + " ]";

      // Actualiza el estado con los datos de VarDesicion
      setshowRestricciones(variablesString);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // -------------------------------------------------------------
  // crea la lista de simbolos (API)
  // -------------------------------------------------------------
  const listaSimbolos = async () => {
    var newVariable = {
      simbols: selectGuardar,
    };
    if (numRestricciones !== newVariable.simbols.length) {
      alert("Debe seleccionar el ingresar todas los simbolos <=, = o >=.");
      return;
    } else {
      const serviceUrl = `http://localhost:8000/listSimbolos `;
      let config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      axios.post(serviceUrl, newVariable, config); //then es usando promises, se puede asignar a una variable si quiere sin promises
    }
  };

  // -------------------------------------------------------------
  // seleciona las Restricciones (API)
  // -------------------------------------------------------------
  const crearMatrizAPI = async () => {
    await listaSimbolos();
    await createVariableDecision();
    await createRestricciones();
  };

  // -------------------------------------------------------------
  // llama selectVariables cada vez que carga la pantalla
  // -------------------------------------------------------------
  useEffect(() => {
    // Obtenemos la cadena de consulta de la URL
    const queryString = window.location.search;

    // Creamos un objeto URLSearchParams para analizar la cadena de consulta
    const params = new URLSearchParams(queryString);

    // Obtenemos el valor de numVariables y numRestricciones
    const numVariablesReq = parseInt(params.get("numVariables"), 10); // 10 es la base para parsear números
    const numRestriccionesReq = parseInt(params.get("numRestricciones"), 10);

    setNumVariables(numVariablesReq);
    setNumRestricciones(numRestriccionesReq);

    generateVariableInputs(numVariablesReq, numRestriccionesReq);
    selectMatriz();
    selectRestricciones();
  }, []); // El segundo argumento vacío asegura que se llame solo una vez al cargar la página

  // Renderizar la interfaz de usuario
  return (
    <div className="container">
      <div>
        <div className="titulo">
          <h1>Calculadora</h1>
        </div>
        <h3>Entradas para Variables de Decisión:</h3>
        {variablesDeDecision}
      </div>
      <div>
        <h3>Entradas para Restricciones:</h3>
        {restricciones}
      </div>
      <div className="space">
        <button
          className="btn btn-primary"
          type="button"
          onClick={crearMatrizAPI}
        >
          Crear
        </button>
      </div>
      <h3>Matriz</h3>
      {showVarDesicion}
      <h3>Variables restricción</h3>
      {showRestricciones}

    </div>
  );
};
export default Calculadora;

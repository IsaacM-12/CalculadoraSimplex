import { useEffect, useState } from "react";
import axios from "axios";

const Calculadora = () => {
  const [showVarDesicion, setshowVarDesicion] = useState([]);
  const [showRestricciones, setshowRestricciones] = useState([]);

  // Definición de estados iniciales usando useState
  const [numVariables, setNumVariables] = useState(); // Número de variables de decisión
  const [numRestricciones, setNumRestricciones] = useState(); // Número de restricciones

  const [variablesDeDecision, setVariablesDeDecision] = useState([]); // Arreglo para almacenar las entradas de variables de decisión
  const [restricciones, setRestricciones] = useState([]); // Arreglo para almacenar las entradas de restricciones

  const [variablesDesGuardar, setVariablesDesGuardar] = useState([]); // Arreglo para guardar las variables de decisión ingresadas
  const [Restricciones, setRestriccionesGuardar] = useState([]); // Arreglo para guardar las restricciones ingresadas
  const [selectGuardar, setSelectGuardar] = useState([]); // Arreglo para guardar los select de las restricciones

  const [numeroVarDesAPI, setNumeroVarDesAPI] = useState(-1); // vaiable que se envia al API para saber cuantas varibles de desicion tendra la matriz
  const [numeroResAPI, setNumeroResAPI] = useState(-1); // vaiable que se envia al API para saber cuantas restricciones tendra la matriz

  // Función para manejar el cambio en el número de variables de decisión
  const handleNumVariablesChange = (e) => {
    const value = parseInt(e.target.value);
    setNumVariables(value);
    setNumeroVarDesAPI(value);
    generateVariableInputs(value, numRestricciones);
  };

  // Función para manejar el cambio en el número de restricciones
  const handleNumRestriccionesChange = (e) => {
    const value = parseInt(e.target.value);
    setNumRestricciones(value);
    setNumeroResAPI(value);
    generateVariableInputs(numVariables, value);
  };

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

    if (newVariable.variables.length !== numeroVarDesAPI) {
      alert("Debe digitar todas las variables de decision.");
      throw new Error("Falto ingresar variables")
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

  // -------------------------------------------------------------
  // seleciona las variables De Desicion (API)
  // -------------------------------------------------------------
  const selectVariablesDecision = async () => {
    const serviceUrl = "http://localhost:8000/VarDecision";
    try {
      const response = await axios.get(serviceUrl);
      //console.log(response.data)

      // Convierte el arreglo en una cadena separada por comas y luego imprímelo
      const variablesString = " [ " + response.data.join(", ") + " ]";

      // Actualiza el estado con los datos de VarDesicion
      setshowVarDesicion(variablesString);
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

    if (newVariable.restricciones.length !== numeroResAPI) {
      alert("Debe digitar todas las restricciones.");
      throw new Error("Faltan Restricciones")
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
          selectVariablesDecision();
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
    if (numeroResAPI !== newVariable.simbols.length) {
      alert("Debe seleccionar el ingresar todas los simbolos <=, = o >=.");
      throw new Error("No ingreso todos los simbolos")
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
  const crearMatriz = async () => {
    await listaSimbolos();
    await createVariableDecision();
    await createRestricciones();
  };

  // -------------------------------------------------------------
  // llama selectVariables cada vez que carga la pantalla
  // -------------------------------------------------------------
  useEffect(() => {
    selectVariablesDecision();
    selectRestricciones();
  }, []); // El segundo argumento vacío asegura que se llame solo una vez al cargar la página

  // Renderizar la interfaz de usuario
  return (
    <div className="container">
      <h3>Selecciona el número de variables de decisión y restricciones:</h3>
      <div className="form-group">
        <label>Número de Variables de Decisión:</label>
        <br></br>
        <input
          className="inputSelect"
          type="number"
          min="1"
          value={numVariables}
          onChange={handleNumVariablesChange}
        />
      </div>
      <div className="form-group">
        <label>Número de Restricciones:</label>
        <br></br>
        <input
          className="inputSelect"
          type="number"
          min="1"
          value={numRestricciones}
          onChange={handleNumRestriccionesChange}
        />
      </div>
      <div>
        <h3>Entradas para Variables de Decisión:</h3>
        {variablesDeDecision}
      </div>
      <div>
        <h3>Entradas para Restricciones:</h3>
        {restricciones}
      </div>
      <div className="space">
        <button className="btn btn-primary" type="button" onClick={crearMatriz}>
          Crear
        </button>
      </div>
      <h3>Variables Decision</h3>
      {showVarDesicion}
      <h3>Variables restricción</h3>
      {showRestricciones}
    </div>
  );
};
export default Calculadora;

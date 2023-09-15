import { useEffect, useState } from "react";
import axios from "axios";

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

  const [numeroVarDes, setNumeroVarDes] = useState(2);

  // Función para manejar el cambio en el número de variables de decisión
  const handleNumVariablesChange = (e) => {
    const value = parseInt(e.target.value);
    setNumVariables(value);
    generateVariableInputs(value, numRestricciones);
  };

  // Función para manejar el cambio en el número de restricciones
  const handleNumRestriccionesChange = (e) => {
    const value = parseInt(e.target.value);
    setNumRestricciones(value);
    generateVariableInputs(numVariables, value);
  };

  // Función para generar dinámicamente las entradas de variables y restricciones
  const generateVariableInputs = (numVars, numRest) => {
    const variableInputs = [];
    const restriccionInputs = [];
    const variablesDesGuardarArray = [];
    const restriccionesArray = [];

    setNumeroVarDes(numVars);

    // Generar entradas para variables de decisión
    for (let i = 1; i <= numVars; i++) {
      const variableName = `Variable X${i}`;
      variableInputs.push(
        <div key={`var_${i}`}>
          {variableName}:
          <input
            className="VarDesInput"
            type="number"
            onChange={(e) => {
              variablesDesGuardarArray[i - 1] = e.target.value;
              setVariablesDesGuardar([...variablesDesGuardarArray]);
            }}
          />
        </div>
      );
    }

    // Generar entradas para restricciones
    for (let i = 1; i <= numRest; i++) {
      restriccionInputs.push(
        <div key={`restr_${i}`}>
          Restricción {i}:
          <input
            className="VarResInput"
            type="number"
            onChange={(e) => {
              restriccionesArray[i - 1] = e.target.value;
              setRestriccionesGuardar([...restriccionesArray]);
            }}
          />
        </div>
      );
    }

    // Actualizar los estados con las entradas generadas
    setVariablesDeDecision(variableInputs);
    setRestricciones(restriccionInputs);
  };

  // -------------------------------------------------------------
  // crea las variables de desicion (API)
  // -------------------------------------------------------------
  const createVariableDecision = async () => {
    var newVariable = {
      variables: variablesDesGuardar,
    };

    if (newVariable.variables.length !== numeroVarDes) {
      alert("Debe digitar todos los datos.");
    } else {
      const serviceUrl = `http://localhost:8000/VarDecision`;
      let config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      axios
        .post(serviceUrl, newVariable, config) //then es usando promises, se puede asignar a una variable si quiere sin promises
        .then((response) => {
          alert("Agregado con exito");
          selectVariablesDecision();
        });
    }
  };

  // // -------------------------------------------------------------
  // // borra una variables
  // // -------------------------------------------------------------
  // const deleteVariable = async () => {
  //     const serviceUrl = `http://localhost:8000/calculadora`;
  //     try {
  //         // const response = await axios.delete(serviceUrl + inputVarDelete);
  //         alert("Borrado con éxito");
  //         selectVariables();
  //     } catch (error) {
  //         if (error.response) {
  //             // La solicitud fue realizada pero el servidor respondió con un código de error
  //             console.error("Error en la respuesta del servidor:", error.response.data);
  //             alert("Error: No se pudo borrar la variable.");
  //         } else if (error.request) {
  //             // La solicitud se hizo pero no se recibió respuesta
  //             console.error("No se recibió respuesta del servidor:", error.request);
  //             alert("Error: No se pudo conectar al servidor.");
  //         } else {
  //             // Un error ocurrió durante la configuración de la solicitud
  //             console.error("Error durante la configuración de la solicitud:", error.message);
  //             alert("Error: Ocurrió un problema durante la solicitud.");
  //         }
  //     }
  // }

  // -------------------------------------------------------------
  // seleciona las variables De Desicion (API)
  // -------------------------------------------------------------
  const selectVariablesDecision = async () => {
    const serviceUrl = "http://localhost:8000/VarDecision";
    try {
      const response = await axios.get(serviceUrl);

      // Convierte el arreglo en una cadena separada por comas y luego imprímelo
      const variablesString = " [ " + response.data.variables.join(", ") + " ]";

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

    if (newVariable.length >= 0) {
      alert("Debe digitar todos los datos.");
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
          alert("Agregado con exito");
          selectRestricciones();
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
      const varRestricciones = response.data;
      // Actualiza el estado con los datos de VarDesicion
      setshowRestricciones(varRestricciones.restricciones);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
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
      <div className="space">
        <button
          className="btn btn-info"
          type="button"
          onClick={createVariableDecision}
        >
          Crear Variable
        </button>
      </div>
      <div>
        <h3>Entradas para Restricciones:</h3>
        {restricciones}
      </div>
      <div className="space">
        <button
          className="btn btn-primary"
          type="button"
          onClick={createRestricciones}
        >
          Crear Restricciones
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

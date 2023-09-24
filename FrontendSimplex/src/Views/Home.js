import { useState } from "react";

const Home = () => {
  const [numVariables, setNumVariables] = useState(null); // Número de variables de decisión
  const [numRestricciones, setNumRestricciones] = useState(null); // Número de restricciones

  // Función para manejar el cambio en el número de variables de decisión
  const handleNumVariablesChange = (e) => {
    const value = parseInt(e.target.value);
    setNumVariables(value);
  };

  // Función para manejar el cambio en el número de restricciones
  const handleNumRestriccionesChange = (e) => {
    const value = parseInt(e.target.value);
    setNumRestricciones(value);
  };

  const redirectToCalcular = () => {
    // Verificar si numVariables o numRestricciones son nulos o <= 0
    if (
      numVariables === null ||
      numRestricciones === null ||
      numVariables <= 0 ||
      numRestricciones <= 0
    ) {
      // Muestra un mensaje de error o toma alguna otra acción apropiada
      alert(
        "Error: Número de Variables de Decisión o de Restricciones no validos."
      );
      return; // No redirigir si hay un error
    }

    const nuevaURL = `/calcular?numVariables=${numVariables}&numRestricciones=${numRestricciones}`;
    window.location.href = nuevaURL;
  };

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

      <div className="space">
        <button className="btn btn-primary" onClick={redirectToCalcular}>
          Ir a Calcular
        </button>
      </div>
    </div>
  );
};
export default Home;

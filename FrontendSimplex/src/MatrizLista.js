import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";
import * as XLSX from "xlsx";

const MatrizLista = () => {
  const [MatrizShow, setMatrizShow] = useState([]);

  // -------------------------------------------------------------
  // Se ejecuta cada vez que se recarga la pagina
  // -------------------------------------------------------------
  useEffect(() => {
    selectMatriz();
  }, []); // El segundo argumento vacío asegura que se llame solo una vez al cargar la página

  // -------------------------------------------------------------
  // Convierte la tabla del HTML a excel
  // -------------------------------------------------------------
  const handleConvertToExcel = () => {
    // Obtener el elemento de la tabla por su ID
    const table = document.getElementById("table-to-xls");

    // Obtener las filas de la tabla
    const rows = table.querySelectorAll("tr");

    // Crear una matriz para almacenar los datos de la tabla
    const data = [];

    rows.forEach((row) => {
      const rowData = [];
      row.querySelectorAll("td").forEach((cell) => {
        rowData.push(cell.innerText);
      });
      data.push(rowData);
    });

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "MatrizSolucion");

    // Generar el archivo Excel y guardarlo
    XLSX.writeFile(wb, "MatrizSolucion.xlsx");
  };

  // -------------------------------------------------------------
  // Recibe un array y devuelve una tabla de HTML
  // -------------------------------------------------------------
  function crearTablaDesdeArray(matriz) {
    if (!Array.isArray(matriz) || matriz.length === 0) {
      return <p>Aquí aparecerá la matriz.</p>;
    }

    const tablas = matriz.map((tabla, tablaIndex) => (
      <div key={tablaIndex}>
        <h4>Iteracion {tablaIndex + 1}</h4>
        <table className="table table-striped table-dark" id="table-to-xls">
          <tbody>
            {tabla.map((fila, filaIndex) => (
              <tr key={filaIndex}>
                {fila.map((valor, columnaIndex) => (
                  <td key={columnaIndex}>{valor}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ));

    return <div className="container">{tablas}</div>;
  }

  // -------------------------------------------------------------
  // seleciona la matriz (API)
  // -------------------------------------------------------------
  const selectMatriz = async () => {
    const serviceUrl = "http://localhost:8000/matrizFinal";
    try {
      const response = await axios.get(serviceUrl);

      const variablesString = response.data;
      const table = crearTablaDesdeArray(variablesString);

      // Actualiza el estado con los datos de MatrizShow con la tabla que representa la matriz
      setMatrizShow(table);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  // Renderizar la interfaz de usuario
  return (
    <div className="container">
      <h3>Matriz</h3>

      {MatrizShow}

      <div className="space">
        <button className="btn btn-primary" onClick={handleConvertToExcel}>
          Convertir a excel
        </button>
      </div>
    </div>
  );
};
export default MatrizLista;

import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";
import * as XLSX from "xlsx";

const MatrizLista = () => {
  const [MatrizShow, setMatrizShow] = useState([]);

  // -------------------------------------------------------------
  // cuando recarga la pagina llama funciones
  // -------------------------------------------------------------
  useEffect(() => {
    selectMatriz();
  }, []); // El segundo argumento vacío asegura que se llame solo una vez al cargar la página

  // -------------------------------------------------------------
  // convierte la tabla a excel
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
        <table class="table table-striped table-dark" id="table-to-xls">
          <tbody>{filas}</tbody>
        </table>
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

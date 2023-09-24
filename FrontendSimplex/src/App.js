import "./App.css";
import Calculadora from "./Views/Calculadora";
import Home from "./Views/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import MatrizLista from "./Views/MatrizLista";
import Solucion from "./Views/Solucion";

function App() {
  function NotFound() {
    return (
      <div>
        <h1>La página que busca no existe</h1>
      </div>
    );
  }
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/calcular" element={<Calculadora />} />
            <Route path="/matrizLista" element={<MatrizLista />} />
            <Route path="/solucion" element={<Solucion />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

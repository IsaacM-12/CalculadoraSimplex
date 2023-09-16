import "./App.css";
import Calculadora from "./Calculadora";
import Home from "./Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";

function App() {
  function NotFound() {
    return (
      <div>
        <h1>La página que busca no existe</h1>
      </div>
    );
  }
  return (
    <div >
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/calcular" element={<Calculadora />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import DrugDetails from "./pages/DrugDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/drug/:splSetId" element={<DrugDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
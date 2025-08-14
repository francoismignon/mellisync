import { BrowserRouter, Routes, Route } from "react-router";
import Dashboard from "./pages/Dashboard";
import NavBar from "./components/NavBar";
import Apiaries from "./pages/Apiaries";
import NewApiary from "./pages/NewApiary";
import Apiary from "./pages/Apiary";

function App() {
  return (
    <BrowserRouter>
      {/*NavBar utilise react routeur (Link) donc dois être à l'intérieur de BrowserRouter */}
      <NavBar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/ruchers" element={<Apiaries />} />
        <Route path="/ruchers/nouveau" element={<NewApiary />} />
        <Route path="/ruchers/:apiary-id" element={<Apiary />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;

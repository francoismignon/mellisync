import { BrowserRouter, Routes, Route } from "react-router";
import Dashboard from "./pages/Dashboard";
import NavBar from "./components/NavBar";
import Apiaries from "./pages/Apiaries";
import NewApiary from "./pages/NewApiary";
import Apiary from "./pages/Apiary";
import NewHive from "./pages/NewHive";
import Hive from "./pages/Hive";


function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        {/*NavBar utilise react routeur (Link) donc dois être à l'intérieur de BrowserRouter */}
        <NavBar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/ruchers" element={<Apiaries />} />
            <Route path="/ruchers/nouveau" element={<NewApiary />} />
            <Route path="/ruchers/:apiary-id" element={<Apiary />} />
            <Route path="/ruchers/:apiary-id/ruches/nouvelle" element={<NewHive />} />
            <Route path="/ruchers/:apiary-id/ruches/:hive-id" element={<Hive />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
export default App;

import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import axios from "./config/axiosConfig";
import Dashboard from "./pages/Dashboard";
import NavBar from "./components/NavBar";
import Apiaries from "./pages/Apiaries";
import NewApiary from "./pages/NewApiary";
import Apiary from "./pages/Apiary";
import NewHive from "./pages/NewHive";
import Hive from "./pages/Hive";
import NewVisit from "./pages/NewVisit";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      await axios.get('/api/auth/me');
      setIsAuthenticated(true);
    } catch {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }

  if (!isAuthenticated) {
    return (
      <BrowserRouter>
        <div className="min-h-screen bg-slate-200">
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Login />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-200">
        <NavBar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/ruchers" element={<Apiaries />} />
            <Route path="/ruchers/nouveau" element={<NewApiary />} />
            <Route path="/ruchers/:apiary-id" element={<Apiary />} />
            <Route path="/ruchers/:apiary-id/ruches/nouvelle" element={<NewHive />} />
            <Route path="/ruchers/:apiary-id/ruches/:hive-id" element={<Hive />} />
            <Route path="/ruchers/:apiary-id/ruches/:hive-id/visites/nouvelle" element={<NewVisit />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
export default App;

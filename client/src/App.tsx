import './App.css'
import { BrowserRouter, Route } from 'react-router'
import { Routes } from 'react-router'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Apiaries from './pages/Apiaries'
import ApiaryDetail from './pages/ApiaryDetail'
import HiveDetail from './pages/HiveDetail'
import NewInspection from './pages/NewInspection'
import Navigation from './components/Navigation'

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <div className="app" style={{ marginTop: "64px" }}>
        {" "}
        {/* Hauteur AppBar */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/apiaries" element={<Apiaries />} />
          <Route path="/apiaries/:id" element={<ApiaryDetail />} />
          <Route path="/hives/:id" element={<HiveDetail />} />
          <Route path="/inspections/new" element={<NewInspection />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
export default App

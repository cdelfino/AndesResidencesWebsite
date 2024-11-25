import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./components/pages/Login/Login";
import Register from "./components/pages/Register/Register";
import Navbar from "./components/layout/Navbar/Navbar";
import Home from "./components/pages/Home/Home";
import { Footer } from "./components/layout/Footer/Footer";
import "./App.css";
import AgendarRecorrido from "./components/pages/AgendarRecorrido/AgendarRecorrido";
import PropertyDetail from "./components/pages/PropertyDetail/PropertyDetail";
import { fetchData, getProperties } from "./api/jsonbinApi";
import MisReservas from "./components/pages/MisReservas/MisReservas";
import GestionarUsuarios from "./components/pages/GestionarUsuario/GestionarUsuarios";
import GestionarReservas from "./components/pages/GestionarReservas/GestionarReservas";

const App = () => {
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleLogin = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getProperties();
        setProperties(data.properties);
        setLoading(false);
      } catch (err) {
        setError("Error al cargar las propiedades");
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);
  return (
    <Router>
      <div className="app-layout">
        <Navbar user={user} onLogout={handleLogout} setUser={setUser} />

        <div className="app-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/agendarRecorrido"
              element={<AgendarRecorrido userId={user?.id} />}
            />
            <Route
              path="/property/:id"
              element={<PropertyDetail properties={properties} />}
            />
            <Route
              path="/misReservas"
              element={<MisReservas userId={user?.id} />}
            />
            <Route
              path="/gestionarUsuarios"
              element={<GestionarUsuarios userId={user?.id} />}
            />
            <Route
              path="/gestionarReservas"
              element={<GestionarReservas userId={user?.id} />}
            />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;

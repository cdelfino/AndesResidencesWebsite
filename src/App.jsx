import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./components/pages/Login/Login";
import Register from "./components/pages/Register/Register";
import Navbar from "./components/layout/Navbar/Navbar";
import Home from "./components/pages/Home/Home";
import { Footer } from "./components/layout/Footer/Footer";
import "./App.css";
import AgendarRecorrido from "./components/pages/AgendarRecorrido/AgendarRecorrido";
import PublicarPropiedad from "./components/pages/PublicarPropiedad/PublicarPropiedad";
import PropertyDetail from "./components/pages/PropertyDetail/PropertyDetail";
import MisReservas from "./components/pages/MisReservas/MisReservas";
import GestionarUsuarios from "./components/pages/GestionarUsuario/GestionarUsuarios";
import GestionarReservas from "./components/pages/GestionarReservas/GestionarReservas";
import axios from "axios";
import EditarReserva from "./components/pages/GestionarReservas/EditarReserva";

const App = () => {
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      axios
        .get("http://localhost:5000/api/token", {
          headers: {
            Authorization: `Bearer ${storedUser.token}`,
          },
        })
        .then((response) => {
          setUser(response.data);
        });
    }
  }, []);

  const handleLogin = async (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    const response = await axios.get("http://localhost:5000/api/token", {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    setUser(response.data);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/propiedades");
        if (!response.ok) {
          throw new Error("Error al obtener las propiedades");
        }
        const data = await response.json();
        setProperties(data);
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
              element={
                <GestionarUsuarios userId={user?.id} userRole={user?.role} />
              }
            />
            <Route
              path="/gestionarReservas"
              element={
                <GestionarReservas userId={user?.id} userRole={user?.role} />
              }
            />
            <Route
              path="/publicarPropiedad"
              element={
                <PublicarPropiedad userId={user?.id} userRole={user?.role} />
              }
            />
            <Route
              path="/editarReserva/:id"
              element={
                <EditarReserva userId={user?.id} userRole={user?.role} />
              }
            />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;

import React, { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../../../api/jsonbinApi"; 
import { Rings } from "react-loader-spinner";

const GestionarUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const data = await getUsers();

        if (!data || !Array.isArray(data)) {
          throw new Error("El formato del bin no es válido.");
        }

        setUsuarios(data);
      } catch (error) {
        console.error("Error al cargar los usuarios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarios();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que quieres eliminar este usuario?"
    );
    if (!confirmDelete) return;

    try {
      await deleteUser(id); 
      setUsuarios((prevUsuarios) => prevUsuarios.filter((u) => u.id !== id));
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      alert("Hubo un error al intentar eliminar el usuario.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center flex-col justify-center h-screen">
        <Rings height="200" width="200" color="#1E3252" radius="6" />
        <p className="text-center text-lg">Cargando usuarios...</p>
      </div>
    );
  }

  if (usuarios.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-center text-lg">No hay usuarios registrados.</p>
      </div>
    );
  }

  return (
    <section className="bg-white rounded-lg border-slate-100 border-2 p-6 max-w-4xl mx-auto mt-8 mb-12">
      <h2 className="text-2xl font-semibold mb-6">Gestionar Usuarios</h2>
      <ul className="space-y-4">
        {usuarios.map((usuario) => (
          <li
            key={usuario.id}
            className="border border-gray-300 rounded-md p-4 shadow-sm flex justify-between items-center"
          >
            <div>
       
              <p>
                <span className="font-semibold">Correo:</span> {usuario.email}
              </p>
              <p>
                <span className="font-semibold">Rol:</span> {usuario.role}
              </p>
            </div>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              onClick={() => handleDelete(usuario.id)}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default GestionarUsuarios;
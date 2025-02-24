import React, { useEffect, useState } from "react";
import { Rings } from "react-loader-spinner";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MisReservas = ({ userId }) => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/appointments"
        );

        if (!response.data || !Array.isArray(response.data)) {
          throw new Error("El formato del bin no es válido.");
        }

        const userAppointments = response.data.filter(
          (appointment) => appointment.user_id === userId
        );
        setReservas(userAppointments);
      } catch (error) {
        console.error("Error al cargar las reservas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservas();
  }, [userId]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que quieres eliminar esta reserva?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/delete-appointment/${id}`);
      setReservas((prevReservas) => prevReservas.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Error al eliminar la reserva:", error);
      alert("Hubo un error al intentar eliminar la reserva.");
    }
  };

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-center text-lg">
          Por favor, inicia sesión para ver tus reservas.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center flex-col justify-center h-screen">
        <Rings height="200" width="200" color="#1E3252" radius="6" />
        <p className="text-center text-lg">Cargando tus reservas...</p>
      </div>
    );
  }

  if (reservas.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-center text-lg">No tienes reservas registradas.</p>
      </div>
    );
  }

  return (
    <section className="bg-white rounded-lg border-slate-100 border-2 p-6 max-w-4xl mx-auto mt-8 mb-12">
      <h2 className="text-2xl font-semibold mb-6">Mis Reservas</h2>
      <ul className="space-y-4">
        {reservas.map((reserva) => (
          <li
            key={reserva.id}
            className="border border-gray-300 rounded-md p-4 shadow-sm flex justify-between items-center"
          >
            <div>
              <p className="font-semibold text-lg">
                Propiedad: {reserva.propiedad}
              </p>
              <p>
                <span className="font-semibold">Fecha:</span>{" "}
                {new Date(reserva.date).toLocaleDateString()}
              </p>
              <p>
                <span className="font-semibold">Teléfono:</span> {reserva.phone}
              </p>
              <p>
                <span className="font-semibold">Mensaje:</span>{" "}
                {reserva.message || "Sin mensaje adicional"}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                className="bg-[#075985] text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={() => navigate(`/editarReserva/${reserva.id}`)}
              >
                Editar reserva
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={() => handleDelete(reserva.id)}
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default MisReservas;

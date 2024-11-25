import React, { useEffect, useState } from "react";
import { getAppointments, deleteAppointment } from "../../../api/jsonbinApi";
import { Rings } from "react-loader-spinner";

const GestionarReservas = ({userRole}) => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const data = await getAppointments();

        if (!data || !Array.isArray(data.appointments)) {
          throw new Error("El formato del bin no es válido.");
        }

        setReservas(data.appointments);
      } catch (error) {
        console.error("Error al cargar las reservas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservas();
  }, []);
  console.log("Datos de reservas:", reservas);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que quieres eliminar esta reserva?"
    );
    if (!confirmDelete) return;

    try {
      await deleteAppointment(id);
      setReservas((prevReservas) => prevReservas.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Error al eliminar la reserva:", error);
      alert("Hubo un error al intentar eliminar la reserva.");
    }
  };

  if (userRole !== "admin") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-600 text-white p-6 rounded-md">
          <h2 className="text-xl font-semibold">No estás autorizado</h2>
          <p className="mt-2">
            Tu rol no tiene permisos para acceder a esta página.
          </p>
        </div>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="flex items-center flex-col justify-center h-screen">
        <Rings height="200" width="200" color="#1E3252" radius="6" />
        <p className="text-center text-lg">Cargando reservas...</p>
      </div>
    );
  }

  if (reservas.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-center text-lg">No hay reservas registradas.</p>
      </div>
    );
  }

  return (
    <section className="bg-white rounded-lg border-slate-100 border-2 p-6 max-w-4xl mx-auto mt-8 mb-12">
      <h2 className="text-2xl font-semibold mb-6">Gestionar Reservas</h2>
      <ul className="space-y-4">
        {reservas.map((reserva) => (
          <li
            key={reserva.id}
            className="border border-gray-300 rounded-md p-4 shadow-sm flex justify-between items-center"
          >
            <div>
              <p className="font-semibold text-lg">Reserva ID: {reserva.id}</p>
              <p>
                <span className="font-semibold">Usuario:</span>{" "}
                {reserva.userId || "Sin usuario"}
              </p>
              <p>
                <span className="font-semibold">Fecha:</span> {reserva.date}
              </p>
              <p>
                <span className="font-semibold">Propiedad:</span>{" "}
                {reserva.propiedad}
              </p>
              <p>
                <span className="font-semibold">Mensaje:</span>{" "}
                {reserva.message}
              </p>
            </div>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              onClick={() => handleDelete(reserva.id)}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default GestionarReservas;

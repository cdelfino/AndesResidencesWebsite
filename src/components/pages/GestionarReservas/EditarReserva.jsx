import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";

const EditarReserva = ({ userId }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [propiedades, setPropiedades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/propiedades"
        );
        setPropiedades(response.data);
      } catch (err) {
        console.error("Error al obtener propiedades:", err);
      }
    };

    const fetchReservation = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/appointments/${id}`
        );
        formik.setValues(response.data);
      } catch (error) {
        setError("Error al obtener la reserva.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
    fetchReservation();
  }, [id]);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      date: "",
      message: "",
      propiedad: "",
    },
    onSubmit: async (values) => {
      try {
        const response = await axios.put(
          `http://localhost:5000/api/update-appointment/${id}`,
          { appointment: values }
        );

        console.log("Reserva actualizada:", response.data);

        setOpen(true);
        setTimeout(() => navigate("/"), 3000);
      } catch (error) {
        console.error("Error al actualizar la reserva:", error);
      }
    },
  });

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-center text-lg">
          Por favor, inicia sesión para editar tu reserva.
        </p>
      </div>
    );
  }

  return (
    <section className="bg-white rounded-lg border-slate-100 border-2 p-6 max-w-4xl mx-auto mt-8 mb-12">
      <h2 className="text-2xl font-semibold mb-6">Editar Reserva</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="flex flex-col space-y-4">
          {["name", "email", "phone", "date", "message"].map((field) => (
            <div key={field} className="flex flex-col">
              <label
                htmlFor={field}
                className="text-sm font-semibold text-gray-700 mb-1"
              >
                {field === "name"
                  ? "Tu Nombre"
                  : field === "email"
                  ? "Tu Email"
                  : field === "phone"
                  ? "Tu Teléfono"
                  : field === "date"
                  ? "Fecha de la Visita"
                  : "Información adicional"}
              </label>
              {field === "message" ? (
                <textarea
                  id={field}
                  name={field}
                  placeholder="Información adicional"
                  value={formik.values[field]}
                  onChange={formik.handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              ) : (
                <input
                  type={
                    field === "date"
                      ? "date"
                      : field === "phone"
                      ? "tel"
                      : "text"
                  }
                  min={
                    field === "date"
                      ? new Date().toISOString().split("T")[0]
                      : undefined
                  }
                  id={field}
                  name={field}
                  placeholder={`Tu ${
                    field.charAt(0).toUpperCase() + field.slice(1)
                  }`}
                  value={formik.values[field]}
                  onChange={formik.handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              )}
            </div>
          ))}
          <div className="flex flex-col">
            <label
              htmlFor="propiedad"
              className="text-sm font-semibold text-gray-700 mb-1"
            >
              Selecciona una propiedad
            </label>
            <select
              id="propiedad"
              name="propiedad"
              value={formik.values.propiedad}
              onChange={formik.handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Selecciona una propiedad</option>
              {propiedades.map((prop) => (
                <option key={prop.id} value={prop.title}>
                  {prop.title}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-black text-white py-2 px-4 rounded-md font-semibold hover:bg-gray-800"
        >
          Actualizar Reserva
        </button>
      </form>
      {open && (
        <div className="bg-white border-green-500 border-l-4 rounded-md shadow-lg p-4 mt-4">
          <p className="font-medium text-gray-900">Reserva Actualizada</p>
          <p className="mt-1 text-gray-500">
            Tu reserva ha sido actualizada correctamente.
          </p>
        </div>
      )}
    </section>
  );
};

export default EditarReserva;

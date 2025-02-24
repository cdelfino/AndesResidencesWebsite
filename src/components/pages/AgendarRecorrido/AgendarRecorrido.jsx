import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Toast from "@radix-ui/react-toast";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AgendarRecorrido = ({ userId }) => {
  const [open, setOpen] = React.useState(false);
  const [propiedades, setPropiedades] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/propiedades");
        if (!response.ok) {
          throw new Error("Error al obtener las propiedades");
        }
        const data = await response.json();
        setPropiedades(data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

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
        const newAppointment = {
          id: uuidv4(),
          userId,
          ...values,
        };

        const response = await axios.get(
          "http://localhost:5000/api/appointments"
        );

        const updatedAppointments = [...response.data, newAppointment];

        await axios.post("http://localhost:5000/api/update-appointment", {
          appointment: newAppointment,
        });

        // await updateAppointments({ appointments: updatedAppointments });

        setOpen(true);
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } catch (error) {
        console.error("Error al registrar el turno:", error);
      }
    },
  });

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-center text-lg">
          Por favor, inicia sesión para agendar un recorrido.
        </p>
      </div>
    );
  }

  return (
    <section className="bg-white rounded-lg border-slate-100 border-2 p-6 max-w-4xl mx-auto mt-8 mb-12">
      <h2 className="text-2xl font-semibold mb-6">Agendar una Visita</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col">
            <label
              htmlFor="name"
              className="text-sm font-semibold text-gray-700 mb-1"
            >
              Tu Nombre
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Tu Nombre"
              value={formik.values.name}
              onChange={formik.handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="text-sm font-semibold text-gray-700 mb-1"
            >
              Tu Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Tu Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="phone"
              className="text-sm font-semibold text-gray-700 mb-1"
            >
              Tu Teléfono
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="Tu Teléfono"
              value={formik.values.phone}
              onChange={formik.handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="date"
              className="text-sm font-semibold text-gray-700 mb-1"
            >
              Fecha de la Visita
            </label>
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              id="date"
              name="date"
              value={formik.values.date}
              onChange={formik.handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="message"
              className="text-sm font-semibold text-gray-700 mb-1"
            >
              Información adicional
            </label>
            <textarea
              id="message"
              name="message"
              placeholder="Información adicional"
              value={formik.values.message}
              onChange={formik.handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
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
          Agendar Visita
        </button>
      </form>

      <Toast.Provider swipeDirection="right">
        <Toast.Root
          className="bg-white border-green-500 border-l-4 rounded-md shadow-lg p-4 mt-4"
          open={open}
          onOpenChange={setOpen}
        >
          <Toast.Title className="font-medium text-gray-900">
            Visita Agendada
          </Toast.Title>
          <Toast.Description className="mt-1 text-gray-500">
            Nos pondremos en contacto contigo pronto para confirmar tu visita.
          </Toast.Description>
        </Toast.Root>
        <Toast.Viewport className="fixed bottom-0 right-0 flex flex-col p-6 gap-2 w-96 max-w-[100vw] m-0 list-none z-50" />
      </Toast.Provider>
    </section>
  );
};

export default AgendarRecorrido;

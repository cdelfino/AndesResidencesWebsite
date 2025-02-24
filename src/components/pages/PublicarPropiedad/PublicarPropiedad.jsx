import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Toast from "@radix-ui/react-toast";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PublicarPropiedad = ({ userId, userRole }) => {
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
      title: "",
      location: "",
      price: "",
      size: "",
      rooms: "",
      bathrooms: "",
      type: "",
      photoUrl: "",
      description: "",
    },
    onSubmit: async (values) => {
      try {
        const newProperty = {
          id: uuidv4(),
          ...values,
        };
        const response = await axios.get(
          "http://localhost:5000/api/propiedades"
        );

        const updatedProperties = [...response.data, newProperty];

        await axios.post("http://localhost:5000/api/submit-property", {
          property: newProperty,
        });
        setOpen(true);
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } catch (error) {
        console.error("Error al publicar la propiedad:", error);
      }
    },
  });

  if (userRole !== "agente") {
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

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-center text-lg">
          Por favor, inicia sesión para publicar una propiedad.
        </p>
      </div>
    );
  }

  return (
    <section className="bg-white rounded-lg border-slate-100 border-2 p-6 max-w-4xl mx-auto mt-8 mb-12">
      <h2 className="text-2xl font-semibold mb-6">Publicar una propiedad</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col">
            <label
              htmlFor="name"
              className="text-sm font-semibold text-gray-700 mb-1"
            >
              Título de la propiedad
            </label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Ingresá el título de la propiedad"
              value={formik.values.title}
              onChange={formik.handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="location"
              className="text-sm font-semibold text-gray-700 mb-1"
            >
              Ubicación de la propiedad
            </label>
            <input
              type="text"
              id="location"
              name="location"
              placeholder="Ingresá la ubicación de la propiedad"
              value={formik.values.location}
              onChange={formik.handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="description"
              className="text-sm font-semibold text-gray-700 mb-1"
            >
              Descripción
            </label>
            <input
              type="text"
              id="description"
              name="description"
              placeholder="Ingresá una descripción"
              value={formik.values.description}
              onChange={formik.handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="price"
              className="text-sm font-semibold text-gray-700 mb-1"
            >
              Precio
            </label>
            <input
              type="number"
              id="price"
              name="price"
              placeholder="Ingresá el precio"
              value={formik.values.price}
              onChange={formik.handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="size"
              className="text-sm font-semibold text-gray-700 mb-1"
            >
              Tamaño de la propiedad en m²
            </label>
            <input
              type="number"
              id="size"
              name="size"
              value={formik.values.date}
              onChange={formik.handleChange}
              placeholder="Ingresá el tamaño de la propiedad"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="rooms"
              className="text-sm font-semibold text-gray-700 mb-1"
            >
              Habitaciones
            </label>
            <input
              type="number"
              id="rooms"
              name="rooms"
              placeholder="Ingresá la cantidad de habitaciones"
              value={formik.values.rooms}
              onChange={formik.handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="bathrooms"
              className="text-sm font-semibold text-gray-700 mb-1"
            >
              Baños
            </label>
            <input
              type="number"
              id="bathrooms"
              name="bathrooms"
              placeholder="Ingresá la cantidad de baños"
              value={formik.values.bathrooms}
              onChange={formik.handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="type"
              className="text-sm font-semibold text-gray-700 mb-1"
            >
              Tipo de propiedad
            </label>
            <select
              id="type"
              name="type"
              required
              value={formik.values.type}
              onChange={formik.handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="" label="Seleccioná el tipo de propiedad" />
              <option value="Apartamento" label="Apartamento" />
              <option value="Casa" label="Casa" />
            </select>
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="photoUrl"
              className="text-sm font-semibold text-gray-700 mb-1"
            >
              Subí una foto de la propiedad
            </label>
            <input
              type="text"
              id="photoUrl"
              name="photoUrl"
              onChange={formik.handleChange}
              value={formik.values.photoUrl}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-black text-white py-2 px-4 rounded-md font-semibold hover:bg-gray-800"
        >
          Publicar Propiedad
        </button>
      </form>

      <Toast.Provider swipeDirection="right">
        <Toast.Root
          className="bg-white border-green-500 border-l-4 rounded-md shadow-lg p-4 mt-4"
          open={open}
          onOpenChange={setOpen}
        >
          <Toast.Title className="font-medium text-gray-900">
            Propiedad Publicada
          </Toast.Title>
          <Toast.Description className="mt-1 text-gray-500">
            Tu propiedad se ha publicado correctamente.
          </Toast.Description>
        </Toast.Root>
        <Toast.Viewport className="fixed bottom-0 right-0 flex flex-col p-6 gap-2 w-96 max-w-[100vw] m-0 list-none z-50" />
      </Toast.Provider>
    </section>
  );
};

export default PublicarPropiedad;

import React, { useEffect, useState } from "react";
import { getProperties } from "../../../api/jsonbinApi";
import { Rings } from "react-loader-spinner";
import PropertyCard from "../PropertyCard/PropertyCard";

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <Rings height="200" width="200" color="#1E3252" radius="6" />
      </div>
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section className="py-12 px-4 sm:px-8">
      <div className="container mx-auto">
        <h2 className="text-3xl font-semibold mb-8">Nuestras propiedades</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PropertyList;

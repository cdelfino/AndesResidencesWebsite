import React from "react";
import { useParams } from "react-router-dom";
import {
  MapPin,
  BedDouble,
  Bath,
  Expand,
  DollarSign,
  Share2,
  Heart,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Rings } from "react-loader-spinner";

const PropertyDetail = ({ properties }) => {
  const { id } = useParams();
  const property = properties?.find((prop) => prop.id === Number(id));

  if (!property) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <Rings height="200" width="200" color="#1E3252" radius="6" />
      </div>
    );
  }

  const {
    photoUrl,
    title,
    location,
    price,
    rooms,
    bathrooms,
    size,
    description,
    type,
  } = property;

  return (
    <main className="flex-grow">
      <div className="relative h-[50vh] md:h-[60vh] lg:h-[70vh]">
        <img
          src={photoUrl} 
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4 bg-white py-1 px-3 rounded-full text-sm font-semibold text-gray-700">
          {type}
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden p-6 -mt-16 relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
              <div className="flex items-center text-gray-600">
                <MapPin size={18} className="mr-2" />
                <span>{location}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between mb-6">
            <div className="flex items-center text-3xl font-bold text-[#0e3955] mb-2 sm:mb-0">
              <DollarSign size={28} />
              <span>{price.toLocaleString()}</span>
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center text-gray-700">
                <BedDouble size={20} className="mr-2" />
                <span>{rooms} Habitaciones</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Bath size={20} className="mr-2" />
                <span>{bathrooms} Baños</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Expand size={20} className="mr-2" />
                <span>{size} m²</span>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-2xl font-semibold mb-4">Descripción</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">{description}</p>
          </div>
          <div className="flex justify-end mt-auto">
            <Link
              to="/agendarRecorrido"
              className="border border-[#0e3955] text-[#0e3955] px-6 py-3 rounded-lg  font-semibold hover:bg-gray-100 transition duration-300"
            >
              Agendar un recorrido
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PropertyDetail;

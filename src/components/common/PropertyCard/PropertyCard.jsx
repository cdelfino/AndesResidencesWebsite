import React from "react";
import { BedDouble, Bath, MapPin, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

const PropertyCard = ({ property }) => {
  const {
    id,
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
    <div className="bg-white shadow-xl rounded-lg overflow-hidden flex flex-col">
      <div className="relative h-60">
        <img
          src={photoUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4 bg-white py-1 px-3 rounded-full text-sm font-semibold text-gray-700">
          {type}
        </div>
      </div>
      <div className="flex flex-col flex-grow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
        <div className="flex items-center text-gray-600 mb-4">
          <MapPin size={18} className="mr-2" />
          <span>{location}</span>
        </div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center text-2xl font-bold text-[#0e3955]">
            <DollarSign size={24} />
            <span>{price.toLocaleString()}</span>
          </div>
          <div className="flex space-x-4">
            <div className="flex items-center text-gray-700">
              <BedDouble size={20} className="mr-2" />
              <span>{rooms} Habitaciones</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Bath size={20} className="mr-2" />
              <span>{bathrooms} Baños</span>
            </div>
          </div>
        </div>
        <p className="text-gray-700 mb-6 flex-grow">{description}</p>
        <div className="flex justify-between items-center">
          <Link
            to={`/property/${id}`}
            className="bg-[#0e3955] text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition duration-300"
          >
            Ver detalle</Link>
          
          <Link
            to="/agendarRecorrido"
            className="border border-gray-600 text-gray-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300"
          >
            Agendar visita
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;

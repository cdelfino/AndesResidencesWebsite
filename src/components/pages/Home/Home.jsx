import React from "react";
import PropertyList from "../../common/PropertyList/PropertyList";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="bg-white">
      <main>
        <section
          className="py-20 px-4 sm:px-8 text-center bg-gray-50 "
          style={{
            backgroundImage: `
      linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.1)),
      url("https://images.unsplash.com/photo-1589999904249-152205243238?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")
    `,
            backgroundSize: "cover",
            backgroundPositionY: "48%",
            backgroundRepeat: "no-repeat",
            backgroundPositionX: "center",
          }}
        >
          <div className="container mx-auto max-w-3xl py-20 px-4 sm:px-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
              Descubrí Propiedades de Lujo en Argentina
            </h1>
            <p className="text-xl text-white mb-5">
              Explorá los inmuebles más exclusivos en las mejores ubicaciones
              del país
            </p>
            <div className="flex justify-center">
              <Link
                to="/agendarRecorrido"
                className="group relative flex justify-center py-2 px-4 border border-transparent font-medium rounded-md text-white bg-[#0e3955] hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-md"
              >
                Agendá un recorrido
              </Link>
            </div>
          </div>
        </section>
        <section>
          <PropertyList />
        </section>
      </main>
    </div>
  );
};

export default Home;

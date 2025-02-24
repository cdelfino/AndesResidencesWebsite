import { useState, useEffect } from "react";
import { Search, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = ({ user, onLogout, setUser }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAdmin = user?.role === "admin";
  const isAgent = user?.role === "agente";

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        <a className="text-xl font-semibold mr-6" href="/">
          Ândes Residences
        </a>
        <nav
          className={`${
            isMenuOpen ? "flex" : "hidden"
          } md:flex items-center justify-center gap-6 flex-1 absolute md:relative top-16 md:top-0 left-0 w-full md:w-auto bg-white md:bg-transparent p-4 md:p-0 border-b md:border-b-0`}
        >
          <Link to="/" className="text-sm font-medium hover:underline">
            Propiedades
          </Link>
          <Link
            to="/agendarRecorrido"
            className="text-sm font-medium hover:underline"
          >
            Agendar un recorrido
          </Link>
          <Link
            to="/misReservas"
            className="text-sm font-medium hover:underline"
          >
            {" "}
            Mis Reservas
          </Link>
          {isAdmin && (
            <>
              <Link
                to="/gestionarUsuarios"
                className="text-sm font-medium hover:underline"
              >
                Gestionar Usuarios
              </Link>
              <Link
                to="/gestionarReservas"
                className="text-sm font-medium hover:underline"
              >
                Gestionar Reservas
              </Link>
            </>
          )}
          {isAgent && (
            <>
              <Link
                to="/publicarPropiedad"
                className="text-sm font-medium hover:underline"
              >
                Publicar Propiedad
              </Link>
            </>
          )}
        </nav>
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm">{user.email}</span>{" "}
              <button
                onClick={() => {
                  onLogout();
                  setUser(null);
                }}
                className="px-4 py-2 text-sm font-medium bg-black text-white rounded hover:bg-gray-800"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden md:inline-block px-4 py-2 text-sm font-medium hover:bg-gray-100 rounded"
              >
                Iniciar Sesión
              </Link>

              <Link
                to="/register"
                className="hidden md:inline-block px-4 py-2 text-sm font-medium bg-black text-white rounded hover:bg-gray-800"
              >
                Registrate
              </Link>
            </>
          )}

          <button
            className="md:hidden p-2 hover:bg-gray-100 rounded-full"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

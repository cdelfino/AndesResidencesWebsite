import { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Email inválido")
    .required("El email es obligatorio"),
  password: Yup.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("La contraseña es obligatoria"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Las contraseñas no coinciden")
    .required("Debes confirmar la contraseña"),
  role: Yup.string()
    .oneOf(["cliente", "agente"], "Selecciona un rol válido")
    .required("El rol es obligatorio"),
});

const Register = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (values) => {
    try {
      const response = await axios.post("http://localhost:5000/api/register", {
        email: values.email,
        password: values.password,
        role: values.role,
      });

      setMessage(response.data.message);
      setError("");
    } catch (err) {
      setError("Error al registrar usuario");
    }
  };

  return (
    <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crear una cuenta
          </h2>
        </div>

        <Formik
          initialValues={{
            email: "",
            password: "",
            confirmPassword: "",
            role: "cliente",
          }}
          validationSchema={validationSchema}
          onSubmit={handleRegister}
        >
          <Form className="mt-8 space-y-6">
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">
                  Ingresá tu email
                </label>
                <Field
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500"
                />
              </div>

              <div>
                <label htmlFor="password" className="sr-only">
                  Creá una contraseña
                </label>
                <Field
                  type="password"
                  name="password"
                  placeholder="Contraseña"
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                />
                <ErrorMessage
                  name="password"
                  className="text-red-500"
                  component="div"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="sr-only">
                  Confirma tu contraseña
                </label>
                <Field
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirmar Contraseña"
                  className="mb-4 appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                />
                <ErrorMessage
                  name="confirmPassword"
                  className="text-red-500"
                  component="div"
                />
              </div>

              <div className="mt-4 mb-4">
                <label htmlFor="role">Seleccioná un rol</label>
                <Field
                  as="select"
                  name="role"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="cliente">Cliente</option>
                  <option value="agente">Agente</option>
                </Field>
                <ErrorMessage
                  name="role"
                  className="text-red-500"
                  component="div"
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="my-4 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Registrar
                </button>
              </div>
            </div>
          </Form>
        </Formik>

        {message && <p className="text-green-500">{message}</p>}
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </main>
  );
};

export default Register;

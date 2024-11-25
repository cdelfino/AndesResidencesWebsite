import axios from "axios";

const API_KEY = "$2a$10$3/2lZGGvDnsnymcEKsYgPet7IOUGp9YPPx7Wye7n2O2eDRumvG/Gm";
const BASE_URL = "https://api.jsonbin.io/v3/b";

const USERS_BIN_ID = "67436c9fe41b4d34e459dad4";
const PROPERTIES_BIN_ID = "67437973e41b4d34e459df9b";
const APPOINTMENTS_BIN_ID = "6743f0e6ad19ca34f8cfc9de";

const headers = {
  "Content-Type": "application/json",
  "X-Master-Key": API_KEY,
};

export const fetchData = async (binId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${binId}/latest`, {
      headers,
    });
    return response.data.record;
  } catch (error) {
    throw error;
  }
};

export const updateData = async (binId, data) => {
  try {
    await axios.put(`${BASE_URL}/${binId}`, data, { headers });
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const users = await getUsers();

    if (!users || !Array.isArray(users)) {
      throw new Error("El formato del bin no es válido.");
    }

    const updatedUsers = users.filter((user) => user.id !== userId);

    await updateUsers(updatedUsers);

  } catch (error) {
    throw error;
  }
};

export const deleteAppointment = async (appointmentId) => {
  try {
    const data = await getAppointments();

    if (!data || !Array.isArray(data.appointments)) {
      throw new Error("El formato del bin no es válido.");
    }

    const updatedAppointments = data.appointments.filter(
      (appointment) => appointment.id !== appointmentId
    );

    await updateAppointments({ appointments: updatedAppointments });
  } catch (error) {
    console.error("Error eliminando la reserva:", error);
    throw error;
  }
};

export const getUsers = () => fetchData(USERS_BIN_ID);
export const getProperties = () => fetchData(PROPERTIES_BIN_ID);
export const getAppointments = () => fetchData(APPOINTMENTS_BIN_ID);

export const updateUsers = (data) => updateData(USERS_BIN_ID, data);
export const updateProperties = (data) => updateData(PROPERTIES_BIN_ID, data);
export const updateAppointments = (data) =>
  updateData(APPOINTMENTS_BIN_ID, data);

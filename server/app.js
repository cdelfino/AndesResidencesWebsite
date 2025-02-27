import express from "express";
import mysql from "mysql2";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

const jwtPassword = process.env.JWT_PASSWORD;

db.connect((err) => {
  if (err) {
    console.error("Error de conexión a la base de datos:", err.stack);
    return;
  }
  console.log("Conectado a la base de datos MySQL");
});

app.get("/api/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error al obtener usuarios" });
    }
    res.json(results);
  });
});

app.post("/api/delete-user/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM users WHERE id = ?", [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error al eliminar usuario" });
    }
    res.json({ message: "Usuario eliminado con éxito" });
  });
});

app.post("/api/register", async (req, res) => {
  const { email, password, role } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Error al verificar el correo" });
      }
      if (results.length > 0) {
        return res
          .status(400)
          .json({ error: "El correo electrónico ya está registrado" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const query =
        "INSERT INTO users (email, password, role) VALUES (?, ?, ?)";
      db.query(query, [email, hashedPassword, role], (err, results) => {
        if (err) {
          return res.status(500).json({ error: "Error al registrar usuario" });
        }
        res.json({ message: "Usuario registrado con éxito" });
      });
    }
  );
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Error al verificar el correo" });
      }
      if (results.length === 0) {
        return res.status(400).json({ error: "Credenciales incorrectas" });
      }

      const user = results[0];

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ error: "Credenciales incorrectas" });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },

        jwtPassword,
        {
          expiresIn: "1h",
        }
      );

      res.json({ message: "Inicio de sesión exitoso", token });
    }
  );
});

app.get("/api/propiedades", (req, res) => {
  db.query("SELECT * FROM propiedades", (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error al obtener propiedades" });
    }
    res.json(results);
  });
});

app.post("/api/submit-property", (req, res) => {
  const {
    id,
    title,
    location,
    price,
    size,
    rooms,
    bathrooms,
    type,
    photoUrl,
    description,
  } = req.body.property;

  db.query(
    "INSERT INTO propiedades (id, title, location, price, size, rooms, bathrooms, type, photoUrl, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      id,
      title,
      location,
      price,
      size,
      rooms,
      bathrooms,
      type,
      photoUrl,
      description,
    ],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Error al crear la propiedad" });
      }
      res.json({ message: "Propiedad creada con éxito", propertyId: id });
    }
  );
});

app.post("/api/update-appointment", (req, res) => {
  const { id, userId, name, email, phone, date, message, propiedad } =
    req.body.appointment;

  const query = `
    INSERT INTO appointments (id, user_id, name, email, phone, date, message, propiedad) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [id, userId, name, email, phone, date, message, propiedad],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Error al crear el turno" });
      }
      res.json({ message: "Turno creado con éxito", appointmentId: id });
    }
  );
});

app.get("/api/appointments/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM appointments WHERE id = ?", [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error al obtener turno" });
    }
    res.json(results[0]);
  });
});

app.put("/api/update-appointment/:id", (req, res) => {
  const appointmentId = req.params.id;
  const { userId, name, email, phone, date, message, propiedad } =
    req.body.appointment;

  const query = `
    UPDATE appointments 
    SET user_id = ?, name = ?, email = ?, phone = ?, date = ?, message = ?, propiedad = ?
    WHERE id = ?
  `;

  db.query(
    query,
    [userId, name, email, phone, date, message, propiedad, appointmentId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Error al actualizar el turno" });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Turno no encontrado" });
      }
      res.json({ message: "Turno actualizado con éxito" });
    }
  );
});

app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});

app.get("/api/token", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, jwtPassword, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    res.json(user);
  });
});

app.get("/api/appointments", (req, res) => {
  db.query("SELECT * FROM appointments", (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error al obtener turnos" });
    }
    res.json(results);
  });
});

app.delete("/api/delete-appointment/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM appointments WHERE id = ?", [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error al eliminar turno" });
    }
    res.json({ message: "Turno eliminado con éxito" });
  });
});

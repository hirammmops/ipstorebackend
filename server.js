const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// Conexión a la base de datos SQLite
const db = new sqlite3.Database('./data/iphone-store.db', (err) => {
  if (err) {
    console.error("Error al conectar con la base de datos", err);
  } else {
    console.log("Conectado a la base de datos SQLite");
  }
});

// Crear tabla en la base de datos (si no existe)
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS ip_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    model TEXT,
    color TEXT,
    storage TEXT,
    quantity INTEGER,
    name TEXT,
    card TEXT,
    address TEXT,
    ip TEXT
  )`);
});

// Middleware para poder recibir JSON en el cuerpo de las solicitudes
app.use(bodyParser.json());

// Ruta para guardar la IP y datos del pedido
app.post('/guardar-ip', (req, res) => {
  const { model, color, storage, quantity, name, card, address, ip } = req.body;

  // Inserta los datos recibidos en la base de datos
  const stmt = db.prepare("INSERT INTO ip_data (model, color, storage, quantity, name, card, address, ip) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
  stmt.run(model, color, storage, quantity, name, card, address, ip, function(err) {
    if (err) {
      return res.status(500).send("Error al guardar los datos.");
    }
    res.status(200).send("Datos guardados correctamente.");
  });

  stmt.finalize();
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
app.post("/guardar-compra", (req, res) => {
  const datos = req.body;
  console.log("Compra simulada:", datos);
  res.json({ mensaje: "Compra simulada recibida" });
});
const path = require("path");
const fs = require("fs");
const express = require("express");
require("dotenv").config();

const { ensureSchema, query } = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

/* =====================
   MIDDLEWARES
===================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

/* =====================
   HEALTH CHECK
===================== */
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

/* =====================
   HTML RENDER
===================== */
function renderPage(title, contentFile) {
  const viewsPath = path.join(__dirname, "views");
  const layoutPath = path.join(viewsPath, "layout.html");
  const contentPath = path.join(viewsPath, contentFile);

  if (!fs.existsSync(layoutPath)) {
    return "<h1>Error</h1><p>No se encontró layout.html</p>";
  }

  if (!fs.existsSync(contentPath)) {
    return `<h1>Error</h1><p>No se encontró ${contentFile}</p>`;
  }

  const layout = fs.readFileSync(layoutPath, "utf8");
  const content = fs.readFileSync(contentPath, "utf8");

  return layout
    .replace("{{TITLE}}", title)
    .replace("{{CONTENT}}", content);
}

/* =====================
   ROUTES (VISTAS)
===================== */
app.get("/", (req, res) => {
  res.send(renderPage("Orchid Spa - Inicio", "index.html"));
});

app.get("/reservations", (req, res) => {
  res.send(renderPage("Orchid Spa - Reservaciones", "reservations.html"));
});

/* =====================
   API /api/reservations
===================== */
const router = express.Router();

/*
  GET /api/reservations
  Lista solo reservaciones activas (no canceladas)
*/
router.get("/", async (req, res) => {
  try {
    const rows = await query(
      "SELECT * FROM reservations WHERE status <> 'CANCELED' ORDER BY id DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener reservaciones" });
  }
});

/*
  POST /api/reservations
  Crear nueva reservación
*/
router.post("/", async (req, res) => {
  const { customer_name, service, date, time } = req.body;

  if (!customer_name || !service || !date || !time) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  try {
    await query(
      "INSERT INTO reservations (customer_name, service, date, time) VALUES (?,?,?,?)",
      [customer_name, service, date, time]
    );
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al insertar reservación" });
  }
});

/*
  DELETE /api/reservations/:id
  Cancelar reservación (borrado lógico)
*/
router.delete("/:id", async (req, res) => {
  try {
    await query(
      "UPDATE reservations SET status='CANCELED' WHERE id=?",
      [req.params.id]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al cancelar reservación" });
  }
});

app.use("/api/reservations", router);

/* =====================
   START SERVER
===================== */
async function startServer() {
  try {
    await ensureSchema();
    console.log("Base de datos verificada");
  } catch (err) {
    console.log("Aviso: BD no disponible aún (esto es normal en local)");
  }

  const { ensureSchema } = require("./db");

ensureSchema()
  .then(() => console.log("Esquema de BD verificado"))
  .catch(err => console.error("Error creando esquema", err));


 app.listen(3000, "0.0.0.0", () => {
  console.log("Servidor activo en 3000");
});

}

startServer();

module.exports = app;

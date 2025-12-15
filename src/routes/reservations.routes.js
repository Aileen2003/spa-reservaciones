const express = require("express");
const router = express.Router();
const { query } = require("../db");

// GET /api/reservations
router.get("/", async (req, res) => {
  try {
    const rows = await query("SELECT * FROM reservations ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener reservaciones" });
  }
});

// POST /api/reservations
router.post("/", async (req, res) => {
  const { customer_name, service, date, time } = req.body;

  if (!customer_name || !service || !date || !time) {
    return res.status(400).json({ error: "Campos obligatorios" });
  }

  try {
    await query(
      "INSERT INTO reservations (customer_name, service, date, time) VALUES (?,?,?,?)",
      [customer_name, service, date, time]
    );
    res.status(201).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Error al crear reservación" });
  }
});

// DELETE /api/reservations/:id
router.delete("/:id", async (req, res) => {
  try {
    await query(
      "UPDATE reservations SET status='CANCELED' WHERE id=?",
      [req.params.id]
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "Error al cancelar" });
  }
});

module.exports = router;

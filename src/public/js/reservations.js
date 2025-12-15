const form = document.getElementById("reservation-form");
const list = document.getElementById("reservations-list");

/* =========================
   CARGAR RESERVACIONES
========================= */
async function loadReservations() {
  const res = await fetch("/api/reservations");
  const data = await res.json();

  list.innerHTML = "";

  if (data.length === 0) {
    list.innerHTML = "<p>No hay reservaciones registradas.</p>";
    return;
  }

  data.forEach((r) => {
    const card = document.createElement("div");
    card.className = "reservation-item";

    card.innerHTML = `
      <div class="reservation-info">
        <h3>${r.customer_name}</h3>
        <p>${r.service} · ${r.date} ${r.time}</p>
        <span class="reservation-status">${r.status}</span>
      </div>
      <button class="btn-cancel" data-id="${r.id}">
        Cancelar
      </button>
    `;

    list.appendChild(card);
  });

  attachCancelEvents();
}

/* =========================
   CREAR RESERVACIÓN
========================= */
form.addEventListener("submit", async (e) => {
  e.preventDefault(); // 🔴 MUY IMPORTANTE

  const payload = {
    customer_name: form.customer_name.value,
    service: form.service.value,
    date: form.date.value,
    time: form.time.value,
  };

  if (!payload.customer_name || !payload.service) {
    alert("Completa todos los campos");
    return;
  }

  const res = await fetch("/api/reservations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (res.ok) {
    form.reset();
    loadReservations();
  } else {
    alert("Error al registrar la reservación");
  }
});

/* =========================
   CANCELAR
========================= */
function attachCancelEvents() {
  document.querySelectorAll(".btn-cancel").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;

      await fetch(`/api/reservations/${id}`, {
        method: "DELETE",
      });

      loadReservations();
    });
  });
}

/* =========================
   INIT
========================= */
loadReservations();

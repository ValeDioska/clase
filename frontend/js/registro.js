document.addEventListener("DOMContentLoaded", () => {

  const btnRegistro = document.getElementById("btnRegistro");
  const modal = document.getElementById("modalRegistro");
  const cerrarModal = document.querySelector(".cerrar-modal");
  const form = document.getElementById("formRegistro");
  const mensajeExito = document.getElementById("mensajeExito");

  // ABRIR MODAL
  btnRegistro.addEventListener("click", () => {
    modal.style.display = "flex";
  });

  // CERRAR CON LA X
  cerrarModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // CERRAR SI HACEN CLICK FUERA
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // ENVÍO DEL FORMULARIO
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value;
    const correo = document.getElementById("correo").value;

    try {
      const response = await fetch("http://localhost:3000/api/registro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ nombre, correo }) 
      });

      const data = await response.json();

      if (response.ok) {
        mensajeExito.style.display = "block";
        form.reset();
      } else {
        alert("Error al registrar");
      }

    } catch (error) {
      console.error(error);
      alert("Error de conexión con el servidor");
    }
  });

});
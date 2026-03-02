import express from "express";
import { registrarUsuario } from "../services/supabaseService.js";
import { enviarCorreo } from "../utils/mailer.js";

const router = express.Router();

router.post("/registro", async (req, res) => {
  const { nombre, correo } = req.body;

  if (!nombre || !correo) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  try {
    // Guardar en base de datos
    await registrarUsuario(nombre, correo);

    // Enviar correo
    await enviarCorreo(correo, nombre);

    res.json({ success: true, message: "Registro exitoso" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
import nodemailer from "nodemailer";

export async function enviarCorreo(correo, nombre) {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: correo,
    subject: "Bienvenido a Cuatro Crepas 🍓",
    html: `
      <h2>Hola ${nombre}</h2>
      <p>Gracias por registrarte en Cuatro Crepas.</p>
      <p>Pronto recibirás promociones y noticias especiales.</p>
      <br>
      <p>Con amor por las crepas 🥞</p>
    `
  });
}
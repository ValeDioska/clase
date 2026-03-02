import "./config.js";   

import express from "express";
import cors from "cors";
import registroRoutes from "./routes/registro.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", registroRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
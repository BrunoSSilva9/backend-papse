import express from "express";
import pacienteRoutes from "./routes/paciente.routes.js";
import colaboradorRoutes from "./routes/colaborador.routes.js";

console.log("✅ server.ts foi carregado");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api", pacienteRoutes);
app.use("/api", colaboradorRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "API está funcionando!" });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

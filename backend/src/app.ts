import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import authRoutes from "./routes/auth.route";
import classesRoutes from "./routes/classes.route";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Auth routes
app.use("/auth", authRoutes);
app.use("/classes", classesRoutes);

app.get("/health-check", (req, res) => {
  res.send({ message: "Server healthy" });
});

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

server.on("error", console.error);

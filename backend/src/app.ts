import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { errorHandler } from "./middlewares/errorHandler";
import authRoutes from "./routes/auth.route";
import classesRoutes from "./routes/class.route";
import homeworkRoutes from "./routes/homework.route";
import libraryRoutes from "./routes/library.route";
import parentRoutes from "./routes/parent.route";
import studentRoutes from "./routes/student.route";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/classes", classesRoutes);
app.use("/students", studentRoutes);
app.use("/parents", parentRoutes);
app.use("/libraries", libraryRoutes);
app.use("/homeworks", homeworkRoutes);

app.get("/health-check", (req, res) => {
  res.send({ message: "Server healthy" });
});

app.use(errorHandler);

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

server.on("error", console.error);

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./src/routes/auth.routes.js";
import userRoutes from "./src/routes/user.routes.js";
import containerRoutes from "./src/routes/container.routes.js";

import http from "http";
import { setupTerminalWS } from "./src/ws/terminal.ws.js";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/container", containerRoutes);

app.get("/", (_, res) => {
    res.json({
        message: "HackLab API Running",
    });
});

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

setupTerminalWS(server);

server.listen(PORT, () => {
    console.log(
        `Server running on http://localhost:${PORT}`
    );
});
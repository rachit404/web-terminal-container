const express = require("express");
const http = require("http");

const WebSocket = require("ws");

const cors = require("cors");

const pty = require("node-pty");

const app = express();

app.use(cors());

app.get("/", (req, res) => {
    res.send("HackLab PTY Backend Running");
});

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {

    console.log("WebSocket client connected");

    const ptyProcess = pty.spawn(
        "docker",
        [
            "run",
            "-it",
            "--rm",

            "--memory=512m",
            "--cpus=1",

            "ubuntu",
            "bash"
        ],
        {

            name: "xterm-color",

            cols: 120,
            rows: 30,

            cwd: process.env.HOME,

            env: process.env,
        }
    );

    ptyProcess.onData((data) => {
        ws.send(data);
    });

    ws.on("message", (message) => {
        ptyProcess.write(message.toString());
    });

    ws.on("close", () => {

        console.log("Client disconnected");

        ptyProcess.kill();
    });

    ws.on("error", (err) => {
        console.log("WebSocket error:", err);

        ptyProcess.kill();
    });
});

server.listen(3000, () => {
    console.log("PTY backend running on http://localhost:3000");
});
import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import docker from "../lib/docker.js";

import prisma from "../lib/prisma.js";

export const setupTerminalWS = (
    server
) => {

    const wss =
        new WebSocketServer({
            server,
            path: "/terminal",
        });

    wss.on("connection", async (ws, req) => {
            try {
                const url = new URL(
                    req.url,
                    `http://${req.headers.host}`
                );
                const token =
                    url.searchParams.get(
                        "token"
                    );
                const containerId =
                    url.searchParams.get(
                        "containerId"
                    );
                if (!token || !containerId) {
                    ws.close();
                    return;
                }
                const decoded =
                    jwt.verify(
                        token,
                        process.env.JWT_SECRET
                    );
                const container =
                    await prisma.container.findFirst({
                        where: {
                            id: containerId,
                            userId:
                                decoded.userId,
                        },
                    });
                if (!container) {
                    ws.close();
                    return;
                }
                const dockerContainer = docker.getContainer(container.containerId);
                const exec = await dockerContainer.exec({
                    Cmd: ["bash"],
                    AttachStdin: true,
                    AttachStdout: true,
                    AttachStderr: true,
                    Tty: true,
                });
                const stream = await exec.start({ hijack: true, stdin: true, });
                ws.send("Connected to container\r\n");
                stream.on("data", (data) => {
                    ws.send(data.toString());
                });
                ws.on("message", (message) => {
                    stream.write(message);
                });
                ws.on("close", () => {
                    try {
                        stream.end();
                    } catch { }
                });
                
            } catch {
                ws.close();
            }
        }
    );
};
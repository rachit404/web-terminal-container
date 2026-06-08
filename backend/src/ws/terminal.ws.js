import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";

import docker from "../lib/docker.js";
import prisma from "../lib/prisma.js";

export const setupTerminalWS = (server) => {

    const wss = new WebSocketServer({
        server,
        path: "/terminal",
    });

    wss.on("connection", async (ws, req) => {

        let stream = null;

        try {

            const url = new URL(
                req.url,
                `http://${req.headers.host}`
            );

            const token =
                url.searchParams.get("token");

            const containerId =
                url.searchParams.get("containerId");

            if (!token || !containerId) {

                ws.close();

                return;
            }

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            const dbContainer =
                await prisma.container.findFirst({
                    where: {
                        id: containerId,
                        userId: decoded.userId,
                    },
                });

            if (!dbContainer) {

                ws.close();

                return;
            }

            const dockerContainer =
                docker.getContainer(
                    dbContainer.containerId
                );

            const inspect =
                await dockerContainer.inspect();

            if (!inspect.State.Running) {

                ws.send(
                    "\r\nContainer is stopped.\r\n"
                );

                ws.close();

                return;
            }

            console.log(
                "WS Connected:",
                dbContainer.containerId
            );

            const exec =
                await dockerContainer.exec({
                    Cmd: ["/bin/bash"],
                    AttachStdin: true,
                    AttachStdout: true,
                    AttachStderr: true,
                    Tty: true,
                });

            console.log("Exec Created");

            stream =
                await exec.start({
                    hijack: true,
                    stdin: true,
                });

            console.log("Stream Started");

            // ws.send(
            //     "\r\nConnected to container\r\n"
            // );

            stream.on("data", (chunk) => {
                if (ws.readyState === ws.OPEN) {
                    ws.send(chunk);
                }
            });

            ws.on("message", (message) => {
                if (stream) {
                    stream.write(message);
                }
            });

            ws.on("close", () => {
                console.log("WS Closed");
                try {
                    if (stream) {
                        stream.end();
                    }
                } catch (err) {
                    console.error(err);
                }
            });

        } catch (error) {

            console.error(
                "Terminal WS Error:",
                error
            );

            ws.close();
        }
    });
};
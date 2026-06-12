import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import * as pty from "node-pty";

import prisma from "../lib/prisma.js";

export const setupTerminalWS = (server) => {

    const wss = new WebSocketServer({
        server,
        path: "/terminal",
    });

    wss.on(
        "connection",
        async (ws, req) => {

            let shell = null;

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

                if (
                    !token ||
                    !containerId
                ) {

                    ws.close();

                    return;
                }

                const decoded =
                    jwt.verify(
                        token,
                        process.env.JWT_SECRET
                    );

                const dbContainer =
                    await prisma.container.findFirst({
                        where: {
                            id: containerId,
                            userId:
                                decoded.userId,
                        },
                    });

                if (!dbContainer) {

                    ws.close();

                    return;
                }

                shell =
                    pty.spawn(
                        "docker",
                        [
                            "exec",
                            "-it",
                            dbContainer.containerId,
                            "bash",
                        ],
                        {
                            name:
                                "xterm-256color",

                            cols: 120,
                            rows: 30,

                            cwd:
                                "/",

                            env:
                                process.env,
                        }
                    );

                shell.onData(
                    (data) => {

                        if (ws.readyState === WebSocket.OPEN) {

                            ws.send(
                                JSON.stringify({
                                    type:
                                        "output",

                                    data,
                                })
                            );
                        }
                    }
                );

                ws.on(
                    "message",
                    (message) => {

                        try {

                            const msg =
                                JSON.parse(
                                    message.toString()
                                );

                            if (
                                msg.type ===
                                "input"
                            ) {

                                shell.write(
                                    msg.data
                                );

                                return;
                            }

                            if (
                                msg.type ===
                                "resize"
                            ) {

                                shell.resize(
                                    msg.cols,
                                    msg.rows
                                );

                                return;
                            }

                        } catch (
                            err
                        ) {

                            console.error(
                                err
                            );
                        }
                    }
                );

                ws.on(
                    "close",
                    () => {

                        if (
                            shell
                        ) {

                            shell.kill();
                        }
                    }
                );

            } catch (
                error
            ) {

                console.error(
                    error
                );

                ws.close();

                if (
                    shell
                ) {

                    shell.kill();
                }
            }
        }
    );
};
import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";

import prisma from "../lib/prisma.js";

export const setupTerminalWS = (
    server
) => {

    const wss =
        new WebSocketServer({
            server,
            path: "/terminal",
        });

    wss.on(
        "connection",
        async (ws, req) => {

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

                ws.send(
                    "Authenticated\r\n"
                );

            } catch {

                ws.close();
            }
        }
    );
};
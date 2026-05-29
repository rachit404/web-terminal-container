import { WebSocketServer } from "ws";

import docker from "../lib/docker.js";

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

            console.log(
                "Terminal connected"
            );

            ws.send(
                "Connected\r\n"
            );
        }
    );
};
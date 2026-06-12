import { useEffect, useRef } from "react";

import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";

import "@xterm/xterm/css/xterm.css";
import { WS_URL } from "../config/env";

interface XTerminalProps {
    containerId: string;
}

export default function XTerminal({
    containerId,
}: XTerminalProps) {
    const terminalRef =
        useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const term = new Terminal({
            convertEol: true,
            cursorBlink: true,
            fontSize: 15,

            fontFamily:
                "Fira Code, Consolas, monospace",

            theme: {
                background: "#0f172a",
                foreground: "#e2e8f0",

                cursor: "#38bdf8",

                black: "#1e293b",
                red: "#ef4444",
                green: "#22c55e",
                yellow: "#eab308",
                blue: "#3b82f6",
                magenta: "#d946ef",
                cyan: "#06b6d4",
                white: "#f8fafc",
            },
        });

        const fitAddon =
            new FitAddon();

        term.loadAddon(fitAddon);

        if (!terminalRef.current) {
            return;
        }

        term.open(
            terminalRef.current
        );

        fitAddon.fit();
        console.log(
            "INITIAL SIZE:",
            term.cols,
            term.rows
        );

        const token =
            localStorage.getItem(
                "token"
            );

        if (!token) {
            term.writeln(
                "\r\nAuthentication token not found."
            );

            return;
        }

        const socket =
            new WebSocket(
                `${WS_URL}/terminal?token=${token}&containerId=${containerId}`
            );

        const sendResize = () => {

            console.log(
                "SEND RESIZE",
                {
                    cols: term.cols,
                    rows: term.rows,
                    state: socket.readyState,
                }
            );

            fitAddon.fit();

            if (
                socket.readyState ===
                WebSocket.OPEN
            ) {

                const payload =
                    JSON.stringify({
                        type: "resize",
                        cols: term.cols,
                        rows: term.rows,
                    });

                console.log(
                    "SENDING:",
                    payload
                );

                socket.send(payload);
            }
        };

        socket.onopen = () => {

    console.log(
        "SOCKET OPEN"
    );

    sendResize();
};

        socket.onmessage = (event) => {
            console.log("WS GOT DATA", event.data);
            term.write(event.data);
        };

        socket.onerror = () => {
            term.writeln("");
            term.writeln(
                "[WebSocket Error]"
            );
        };

        socket.onclose = () => {
            term.writeln("");
            term.writeln(
                "[Connection Closed]"
            );
        };

        term.onData((data) => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(data);
            }
        });

        const resizeHandler = () => {
            sendResize();
        };

        window.addEventListener(
            "resize",
            resizeHandler
        );

        return () => {
            window.removeEventListener(
                "resize",
                resizeHandler
            );

            if (
                socket.readyState ===
                    WebSocket.OPEN ||
                socket.readyState ===
                    WebSocket.CONNECTING
            ) {
                socket.close();
            }

            term.dispose();
        };
    }, [containerId]);

    return (
        <div
            ref={terminalRef}
            className="w-full h-full"
        />
    );
}
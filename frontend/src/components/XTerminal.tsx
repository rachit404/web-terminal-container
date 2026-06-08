import { useEffect, useRef } from "react";

import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";

import "@xterm/xterm/css/xterm.css";

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

            cursorBlink: true,

            fontSize: 15,

            fontFamily:
                "Fira Code, Consolas, monospace",

            theme: {
                background: "#020617",
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

        term.loadAddon(
            fitAddon
        );

        if (
            !terminalRef.current
        ) {
            return;
        }

        term.open(
            terminalRef.current
        );

        fitAddon.fit();

        term.writeln("");
        term.writeln(
            "Welcome to HackLab"
        );
        term.writeln("");

        term.writeln(
            `Container: ${containerId}`
        );

        term.writeln("");

        const token =
            localStorage.getItem(
                "token"
            );

        if (!token) {

            term.writeln(
                "Authentication token not found."
            );

            return;
        }

        const protocol =
            window.location.protocol ===
            "https:"
                ? "wss"
                : "ws";

        const socket =
            new WebSocket(
                `${protocol}://${window.location.host}/terminal?token=${token}&containerId=${containerId}`
            );

        socket.onopen = () => {

            term.writeln(
                "Connecting..."
            );
        };

        socket.onmessage = (
            event
        ) => {

            term.write(
                event.data
            );
        };

        socket.onerror = () => {

            term.writeln(
                "\r\n[WebSocket Error]"
            );
        };

        socket.onclose = () => {

            term.writeln(
                "\r\n[Connection Closed]"
            );
        };

        term.onData(
            (data) => {

                if (
                    socket.readyState ===
                    WebSocket.OPEN
                ) {

                    socket.send(
                        data
                    );
                }
            }
        );

        const resizeHandler =
            () => {

                fitAddon.fit();
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

            socket.close();

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
import { useParams } from "react-router-dom";

import XTerminal from "../components/XTerminal";

export default function TerminalPage() {

    const { containerId } =
        useParams();

    return (
        <div className="h-screen bg-slate-950">

            <div className="h-14 border-b border-slate-800 flex items-center justify-between px-4 text-white">

                <h1 className="font-semibold">
                    Terminal
                </h1>

                <span className="text-sm text-slate-400">
                    {containerId}
                </span>

            </div>

            <div className="h-[calc(100vh-56px)]">

                <XTerminal
                    containerId={
                        containerId || ""
                    }
                />

            </div>

        </div>
    );
}
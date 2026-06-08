import { useParams } from "react-router-dom";

import XTerminal from "../components/XTerminal";

export default function TerminalPage() {

    const { containerId } = useParams();

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <div className="border-b border-slate-800 bg-slate-900">
                <div className="max-w-[1800px] mx-auto px-6 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold">
                            HackLab Terminal
                        </h1>

                        <p className="text-sm text-slate-400">
                            Interactive Container Shell
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-sm">
                            <div className="w-2 h-2 rounded-full bg-emerald-400" />
                            Connected
                        </div>
                    </div>
                </div>
            </div>
            <div className="max-w-[1800px] mx-auto p-6">
                <div className="mb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold">
                            Container
                        </h2>
                        <p className="text-slate-400 text-sm break-all">
                            {containerId}
                        </p>
                    </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="h-12 border-b border-slate-800 flex items-center px-4 gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="ml-4 text-sm text-slate-400">
                            bash
                        </span>
                    </div>
                    <div
                        className="
                            h-[calc(100vh-220px)]
                            min-h-[600px]
                            p-2
                        "
                    >
                        <XTerminal
                            containerId={
                                containerId || ""
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
import XTerminal from "../components/XTerminal";

export default function TerminalPage() {

    return (
        <div className="h-screen bg-slate-950">

            <div className="h-14 border-b border-slate-800 flex items-center px-4 text-white">

                <h1 className="font-semibold">
                    Terminal
                </h1>

            </div>

            <div className="h-[calc(100vh-56px)]">

                <XTerminal />

            </div>

        </div>
    );
}
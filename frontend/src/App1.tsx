import XTerminal from "./components/Terminal";

export default function App() {
  return (
    <div className="h-screen bg-[#0f172a] text-white flex flex-col">
      
      {/* Navbar */}
      <header className="h-16 border-b border-slate-800 bg-[#111827] flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-cyan-400"></div>

          <h1 className="text-2xl font-bold text-cyan-400">
            HackLab Platform
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-green-400 font-semibold">
            ● Connected
          </div>

          <button className="bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2 rounded-lg font-semibold transition">
            New Session
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <aside className="w-64 border-r border-slate-800 bg-[#111827] p-4 flex flex-col gap-4">

          <div>
            <h2 className="text-slate-400 uppercase text-sm mb-3">
              Navigation
            </h2>

            <div className="flex flex-col gap-2">

              <button className="bg-slate-800 hover:bg-slate-700 p-3 rounded-xl text-left transition">
                Dashboard
              </button>

              <button className="bg-slate-800 hover:bg-slate-700 p-3 rounded-xl text-left transition">
                Active Sessions
              </button>

              <button className="bg-slate-800 hover:bg-slate-700 p-3 rounded-xl text-left transition">
                Containers
              </button>

              <button className="bg-slate-800 hover:bg-slate-700 p-3 rounded-xl text-left transition">
                Settings
              </button>

            </div>
          </div>

          <div className="mt-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <h3 className="text-cyan-400 font-semibold mb-2">
                Infrastructure Status
              </h3>

              <div className="text-sm text-slate-300 space-y-2">
                <p>Docker Runtime: Active</p>
                <p>WebSocket: Connected</p>
                <p>PTY Service: Ready</p>
              </div>
            </div>
          </div>

        </aside>

        {/* Terminal Workspace */}
        <main className="flex-1 p-6 overflow-hidden">

          <div className="h-full rounded-2xl border border-slate-800 bg-[#020617] shadow-2xl flex flex-col overflow-hidden">

            {/* Terminal Header */}
            <div className="h-12 border-b border-slate-800 bg-[#111827] flex items-center px-4 gap-2">

              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>

              <div className="ml-4 text-slate-400 text-sm">
                terminal-session-1
              </div>
            </div>

            {/* Terminal Area */}
            <div className="flex-1 overflow-hidden">
              <XTerminal />
            </div>
          </div>

        </main>

      </div>
    </div>
  );
}
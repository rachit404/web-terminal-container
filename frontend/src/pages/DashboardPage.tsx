import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {

    const {
        user,
        logout,
    } = useAuth();

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6">
                <div>
                    <h1 className="text-xl font-bold text-cyan-400">
                        HackLab Dashboard
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="font-medium">
                            {user?.username}
                        </p>
                        <p className="text-sm text-slate-400">
                            {user?.email}
                        </p>
                    </div>
                    <button
                        onClick={logout}
                        className="bg-red-500 hover:bg-red-400 text-white px-4 py-2 rounded-lg cursor-pointer"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <main className="p-6">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h2 className="text-2xl font-semibold mb-2">
                        Welcome back, {user?.username}
                    </h2>
                    <p className="text-slate-400">
                        Authentication system is working.
                    </p>
                </div>
            </main>
        </div>
    );
}
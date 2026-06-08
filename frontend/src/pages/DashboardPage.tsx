import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import {
    getMyContainers,
    createContainer,
    startContainer,
    stopContainer,
} from "../services/container.service";

import type { Container }
from "../types/container";

export default function DashboardPage() {

    // const navigate = useNavigate();

    const { user, logout } =
        useAuth();

    const [containers,
        setContainers] =
        useState<Container[]>([]);

    const loadContainers =
        async () => {

            const response =
                await getMyContainers();

            setContainers(response.data);
        };

    useEffect(() => {

        loadContainers();

    }, []);

    const handleCreate =
        async () => {

            await createContainer();

            await loadContainers();
        };

    return (

        <div className="min-h-screen bg-slate-950 text-white">

            <header className="border-b border-slate-800 p-4 flex justify-between">

                <div>

                    <h1 className="text-2xl font-bold text-cyan-400">
                        HackLab
                    </h1>

                    <p>
                        {user?.username}
                    </p>

                </div>

                <button
                    onClick={logout}
                    className="bg-red-500 px-4 py-2 rounded cursor-pointer hover:bg-red-400 transition-colors"
                >
                    Logout
                </button>

            </header>

            <main className="p-6">

                <div className="mb-6">

                    <button
                        onClick={handleCreate}
                        className="bg-cyan-500 text-black px-4 py-2 rounded cursor-pointer hover:bg-cyan-400 transition-colors"
                    >
                        Create Container
                    </button>

                </div>

                <div className="grid gap-4">

                    {containers.length ? containers.map(
                        (container) => (

                            <div
                                key={container.id}
                                className="bg-slate-900 border border-slate-800 p-4 rounded-xl"
                            >

                                <h3 className="font-bold">
                                    {container.name}
                                </h3>

                                <p>
                                    Status:
                                    {" "}
                                    {container.status}
                                </p>

                                <div className="flex gap-2 mt-4">

                                    <button
                                        onClick={async () => {

                                            await startContainer(
                                                container.id
                                            );

                                            loadContainers();
                                        }}
                                        className="bg-green-600 px-3 py-1 rounded cursor-pointer hover:bg-green-400 transition-colors"
                                    >
                                        Start
                                    </button>

                                    <button
                                        onClick={async () => {

                                            await stopContainer(
                                                container.id
                                            );

                                            loadContainers();
                                        }}
                                        className="bg-yellow-600 px-3 py-1 rounded cursor-pointer hover:bg-yellow-400 transition-colors"
                                    >
                                        Stop
                                    </button>

                                    <button
                                        onClick={() =>
                                            window.open(
                                                `/terminal/${container.id}`,
                                                "_blank"
                                            )
                                        }
                                        className="bg-cyan-600 px-3 py-1 rounded cursor-pointer hover:bg-cyan-400 transition-colors"
                                    >
                                        Open Terminal
                                    </button>

                                </div>

                            </div>
                        )
                    ) : (
                        <div>
                            <p>No containers found</p>
                        </div>
                    )}

                </div>

            </main>

        </div>
    );
}
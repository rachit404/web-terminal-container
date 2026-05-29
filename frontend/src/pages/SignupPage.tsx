import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

export default function SignupPage() {
    const navigate = useNavigate();

    const { signup } = useAuth();

    const [username, setUsername] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            await signup(
                username,
                email,
                password
            );

            navigate("/");

        } catch (err: any) {

            setError(
                err?.response?.data?.message ||
                "Signup failed"
            );

        } finally {

            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950">

            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">

                <h1 className="text-3xl font-bold text-center text-cyan-400 mb-2">
                    HackLab
                </h1>

                <p className="text-center text-slate-400 mb-8">
                    Create your account
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >

                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) =>
                            setUsername(
                                e.target.value
                            )
                        }
                        className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white outline-none"
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) =>
                            setEmail(
                                e.target.value
                            )
                        }
                        className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white outline-none"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(
                                e.target.value
                            )
                        }
                        className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white outline-none"
                    />

                    {error && (
                        <p className="text-red-400 text-sm">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-semibold p-3 rounded-lg disabled:opacity-50 cursor-pointer"
                    >
                        {loading
                            ? "Creating Account..."
                            : "Sign Up"}
                    </button>

                </form>

                <p className="mt-6 text-center text-slate-400">

                    Already have an account?

                    <Link
                        to="/login"
                        className="text-cyan-400 ml-2 cursor-pointer"
                    >
                        Login
                    </Link>

                </p>

            </div>

        </div>
    );
}
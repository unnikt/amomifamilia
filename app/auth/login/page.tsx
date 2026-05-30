"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/client/firebaseClient";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    async function handleEmailLogin(e: any) {
        e.preventDefault();
        setError("");

        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/"); // redirect after login
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unexpected error occurred.");
            }
        }
    }

    async function handleGoogleLogin() {
        setError("");

        try {
            await signInWithPopup(auth, googleProvider);
            router.push("/"); // redirect after login
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unexpected error occurred.");
            }
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="bg-white p-6 rounded shadow-md w-80 space-y-4">
                <h1 className="text-xl font-semibold text-center">Sign In</h1>

                {error && <p className="text-red-600 text-sm">{error}</p>}

                {/* Google Sign-In */}
                <button
                    onClick={handleGoogleLogin}
                    className="w-full bg-(--primary)/80 text-white py-2 rounded hover:bg-red-700"
                >
                    Sign in with Google
                </button>

                <div className="text-center text-gray-400 text-sm">or</div>

                {/* Email Sign-In */}
                <form onSubmit={handleEmailLogin} className="space-y-3">
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full border p-2 rounded"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full border p-2 rounded"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
}

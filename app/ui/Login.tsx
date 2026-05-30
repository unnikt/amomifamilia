"use client";

import { useState } from "react";
import { login } from "@/lib/client/authActions";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin() {
        try {
            const user = await login(email, password);
            console.log("Logged in:", user.uid);
        } catch (err) {
            console.error("Login failed:", err);
        }
    }

    return (
        <div>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}

"use client";

import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/client/firebaseClient";
import { useRouter } from "next/navigation";

export default function LogoffPage() {
    const router = useRouter();

    async function handleSignOut() {
        try {
            await signOut(auth);
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            router.push("/auth/login");
        }

    }

    return (
        <div className="flex justify-center items-center mt-8">
            <button
                className="bg-(--primary) text-(--text) p-2 shadow rounded"
                onClick={handleSignOut}>Sign out</button>
        </div>
    );
}

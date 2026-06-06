"use client";

import { useState } from "react";
import { db } from "@/lib/client/firebaseClient";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { groupExists } from "@/lib/firestore/groupExists";
import { getAuth } from "firebase/auth";
import Link from "next/link";

export default function CreateGroupPage() {
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    async function handleSubmit() {

        if (!name.trim()) {
            setError("Group name is required");
            return;
        }
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            setError("You must be logged in to create a family");
            return;
        }

        setLoading(true);
        setError("");

        // Check if exists
        if (await groupExists(name)) {
            setError("A group with this name already exists");
            setLoading(false);
            return;
        }

        try {
            await addDoc(collection(db, "family"), {
                name: name.trim(),
                createdAt: serverTimestamp(),
                createdBy: user.uid,
                admins: [user.uid]
            });

            router.push("/family"); // redirect to groups list
        } catch (err) {
            console.error(err);
            setError("Failed to create group");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 h-screen">
            <h1 className="text-2xl font-semibold mb-4">Create Family</h1>
            <Link
                href="/family"
                className="text-(--primary) mb-2 inline-block">
                My families
            </Link>


            <div>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    placeholder="Enter Family name"
                />

                {error && (
                    <p className="text-sm text-red-600 mt-1">{error}</p>
                )}
            </div>

            <button
                disabled={loading}
                onClick={handleSubmit}
                className="bg-(--primary) text-(--text) w-full my-2 p-2 rounded-md shadow disabled:opacity-50"
            >
                {loading ? "Creating..." : "Create"}
            </button>
        </div>
    );
}

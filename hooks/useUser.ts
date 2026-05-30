"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/client/firebaseClient";

export function useUser() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [rights, setRights] = useState<string[]>([]);

    const roles = ["admin", "tagEditor"]; // whatever roles you use

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (u) => {
            setUser(u);
            setLoading(false);

            if (!u) {
                setRights([]);
                return;
            }

            const token = await u.getIdTokenResult(); // 🔥 FIXED
            const newRights = roles.filter(r => token.claims[r]);
            setRights(newRights);
        });

        return () => unsub();
    }, []);

    return { user, loading, rights };
}

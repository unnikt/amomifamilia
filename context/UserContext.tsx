"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/client/firebaseKM.client"; // your firebase client

type UserContextType = {
    user: User | null;
    verifying: boolean;
};

const UserContext = createContext<UserContextType>({
    user: null,
    verifying: true,
});

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [authenticating, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);
            setLoading(false);
        });

        return () => unsub();
    }, []);

    return (
        <UserContext.Provider value={{ user, verifying: authenticating }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}

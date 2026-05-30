import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/client/firebaseClient";

export function useFirebaseUser() {
    const [user, setUser] = useState<any>(undefined);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u || null);
        });
        return () => unsub();
    }, []);

    return user;
}

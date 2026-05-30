"use client";

import Link from "next/link";
import { useFirebaseUser } from "@/hooks/useFirebaseUser";

export default function UserAvatarLink() {
    const user = useFirebaseUser();

    // Still loading session
    if (user === undefined) {
        return (
            <span className="material-symbols-outlined btn-material-icon">
                settings_account_box
            </span>
        );
    }

    // Not logged in → show settings icon linking to login
    if (user === null) {
        return (
            <Link href="/auth/login"
                className="material-symbols-outlined btn-material-icon">
                settings_account_box
            </Link>
        );
    }

    // Logged in → show profile pic linking to /user
    return (
        <Link href="/auth/logoff">
            <img
                src={user.photoURL || "/placeholder.png"}
                alt="User"
                className="w-8 h-8 rounded-full object-cover"
            />
        </Link>
    );
}

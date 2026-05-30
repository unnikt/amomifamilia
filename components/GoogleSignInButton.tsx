"use client";

import { auth, googleProvider } from "@/lib/client/firebaseClient";
import { signInWithPopup } from "firebase/auth";

export default function GoogleSignInButton() {
    async function handleGoogleSignIn() {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            console.log("Google user:", result.user.uid);
        } catch (err) {
            console.error("Google sign-in error:", err);
        }
    }

    return (
        <button onClick={handleGoogleSignIn}>
            Sign in with Google
        </button>
    );
}

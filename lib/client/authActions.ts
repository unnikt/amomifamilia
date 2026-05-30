// lib/authActions.ts
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebaseClient";

export async function login(email: string, password: string) {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
}

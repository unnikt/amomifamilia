import { db } from "@/lib/client/firebaseClient";
import { collection, query, where, getDocs } from "firebase/firestore";

export async function groupExists(name: string): Promise<boolean> {
    const nameLower = name.trim().toLowerCase();

    const q = query(
        collection(db, "family"),
        where("nameLower", "==", nameLower)
    );

    const snap = await getDocs(q);
    return !snap.empty;
}
import { db } from "@/lib/client/firebaseClient";
import {
    collection,
    query,
    where,
    orderBy,
    limit,
    getDocs,
} from "firebase/firestore";
import { Family, Member } from "@/lib/definitions";
import { DB_FAMILY } from "@/lib/const/database";

export async function getFamiliesByName(term: string): Promise<(Family & { id: string })[]> {
    if (!term.trim()) return [];

    const q = query(
        collection(db, DB_FAMILY),
        orderBy("name"),
        where("name", ">=", term),
        where("name", "<=", term + "\uf8ff"),
        limit(10)
    );

    const snap = await getDocs(q);

    return snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Family),
    }));
}

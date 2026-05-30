import { db } from "@/lib/client/firebaseClient";
import {
    collection,
    query,
    where,
    orderBy,
    limit,
    getDocs,
} from "firebase/firestore";
import { Member } from "@/lib/definitions";

export async function getMembersByName(term: string): Promise<(Member & { id: string })[]> {
    if (!term.trim()) return [];

    const q = query(
        collection(db, "members"),
        orderBy("name"),
        where("name", ">=", term),
        where("name", "<=", term + "\uf8ff"),
        limit(10)
    );

    const snap = await getDocs(q);

    return snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Member),
    }));
}

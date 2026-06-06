import { db } from "@/lib/client/firebaseClient";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Member } from "./definitions";
import { DB_MEMBERS } from "./const/database";

export async function getMembersByIds(ids: string[]) {
    if (ids.length === 0) return [];

    const q = query(
        collection(db, DB_MEMBERS),
        where("__name__", "in", ids)
    );

    const snap = await getDocs(q);

    return snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Member),
    }));
}

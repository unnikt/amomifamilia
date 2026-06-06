// lib/getMembers.ts
import { db } from "@/lib/client/firebaseClient";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { Member } from "./definitions";
import { DB_MEMBERS } from "./const/database";

export async function getMembers(): Promise<(Member & { id: string })[]> {
    const q = query(collection(db, DB_MEMBERS), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Member),
    }));
}

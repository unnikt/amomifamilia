// lib/getMembers.ts
import { db } from "@/lib/client/firebaseClient";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { Member } from "./definitions";

export async function getMembers(): Promise<(Member & { id: string })[]> {
    const q = query(collection(db, "members"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Member),
    }));
}

import { db } from "@/lib/client/firebaseClient";
import { collection, query, where, getDocs } from "firebase/firestore";

export async function getMyFamilies(uid: string) {
    const q = query(
        collection(db, "family"),
        where("createdBy", "==", uid)
    );

    const snap = await getDocs(q);

    return snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
    }));
}

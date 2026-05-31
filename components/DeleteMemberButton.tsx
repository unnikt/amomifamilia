"use client";

import { deleteObject, ref } from "firebase/storage";
import { doc, deleteDoc } from "firebase/firestore";
import { storage, db } from "@/lib/client/firebaseClient";
import { useRouter } from "next/navigation";

export default function DeleteMemberButton({ id }: { id: string }) {
    const router = useRouter();

    async function handleDelete() {
        // Delete profile picture
        const picRef = ref(storage, `members/${id}_profile.jpg`);
        try {
            await deleteObject(picRef);
        } catch (err) {
            console.warn("No profile picture to delete");
        }

        // Delete Firestore document
        await deleteDoc(doc(db, "members", id));

        // Redirect
        router.push("/");
    }

    return (
        <button
            onClick={handleDelete}
            className="material-symbols-outlined w-8 text-slate-500"
        >
            delete
        </button>
    );
}

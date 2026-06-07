"use client"
import { useState } from "react";
import Modal from "./Modal";
import { DB_FAMILY } from "@/lib/const/database";
import { arrayUnion, doc, updateDoc, } from "firebase/firestore";
import { db } from "@/lib/client/firebaseClient";
import FamilySearch from "./FamilySearch";
import { useRouter } from "next/navigation";

interface Props {
    pid: string;
}
export default function AddSubFamily({ pid }: Props) {
    const [open, setOpen] = useState(false);
    const [subfamid, setSubfamid] = useState("");
    const [subfamname, setSubfamname] = useState("");
    const router = useRouter();

    async function handleSave() {
        if (!subfamid) return;

        const ref = doc(db, DB_FAMILY, pid);

        await updateDoc(ref, {
            subfamilies: arrayUnion({ id: subfamid, name: subfamname }),
            updatedAt: new Date().toISOString(),
        });

        const child = doc(db, DB_FAMILY, subfamid);
        await updateDoc(child, {
            parents: arrayUnion(pid),
            updatedAt: new Date().toISOString(),
        });

        setOpen(false);
        router.refresh();
    }

    return (
        <div>
            <button
                className="material-symbols-outlined"
                onClick={() => setOpen(true)}>
                add
            </button>
            <Modal
                title="Add sub family"
                isOpen={open}
                onClose={() => setOpen(false)}
            >
                <div className="p-4 flex flex-col gap-2">
                    <FamilySearch onSelect={(f) => { setSubfamid(f.id); setSubfamname(f.name) }} />
                    <button
                        className="my-2 mx-auto py-2 px-4 text-(--primary) font-bold border-2 border-(--gray) rounded "
                        onClick={handleSave}>
                        Add
                    </button>
                </div>

            </Modal>
        </div>
    )
}
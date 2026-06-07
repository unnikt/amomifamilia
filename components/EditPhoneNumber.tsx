"use client";
import { useState } from "react";
import PhoneInput from "./PhoneInput";
import { Member } from "@/lib/definitions";
import { db } from "@/lib/client/firebaseClient";
import { doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { DB_MEMBERS } from "@/lib/const/database";
interface Props {
    id: string;
    member: Member;
}
export default function EditPhoneNumber({ id, member }: Props) {
    const [editing, setEditing] = useState(!member.phone);
    // Always initialize with a string
    const [phone] = useState(member.phone || "");
    const [initValue] = useState(member.phone || "");
    const [value, setValue] = useState(member.phone || "");

    async function handleSave() {
        const ref = doc(db, DB_MEMBERS, id);

        if (initValue !== value) {
            await updateDoc(ref, {
                phone: value,
                updatedAt: new Date().toISOString(),
            });
            window.location.reload();
        }
        else setEditing(false);
    }

    // --- VIEW MODE ---
    if (!editing) {
        return phone ? (
            <div className="flex items-center gap-3 my-2">
                <a
                    href={`tel:${phone}`}
                    className="flex items-center gap-1 text-(--primary) tracking-wide py-2"
                >
                    <span className="material-symbols-outlined">call</span>
                    <span>{phone}</span>
                </a>

                <button
                    onClick={() => setEditing(true)}
                    className="material-symbols-outlined text-slate-400 cursor-pointer"
                >
                    edit
                </button>
            </div>
        ) : (
            // If no phone → show input immediately
            <PhoneInput value={value} onChange={setValue} />
        );
    }

    // --- EDIT MODE ---
    return (
        <div className="flex flex-col gap-3 my-2">
            <div className="flex gap-3">
                <PhoneInput value={value} onChange={setValue} />
                <button
                    onClick={handleSave}
                    className="material-symbols-outlined text-(--primary) cursor-pointer"
                >
                    Save
                </button>
            </div>
        </div>
    );
}

"use client";

import { useEffect, useState } from "react";
import PhoneInput from "./PhoneInput";
import { Member } from "@/lib/definitions";
import { db } from "@/lib/client/firebaseClient";
import { doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { DB_MEMBERS } from "@/lib/const/database";
import Modal from "./Modal";
interface Props {
    id: string;
    member: Member;
    field?: "name" | "whoami" | "maritalstat" | "gender" | "dob" | "doe";
    className?: string;
    onClose?: (name: string) => void;
}
export default function EditMember({ id, member, field, className, onClose }: Props) {
    const [editing, setEditing] = useState(false); // Start in edit mode if field is empty
    // Always initialize with a string
    const [value, setValue] = useState("");
    const router = useRouter();

    useEffect(() => {
        if (field) {
            const initialValue = member[field as keyof Member] as string;
            setValue(initialValue);
        }
    }, [member, field]);

    async function handleSave() {
        const ref = doc(db, DB_MEMBERS, id);
        console.log("Saving", { id, field, value });
        if (field)
            await updateDoc(ref, {
                [field]: value,
                updatedAt: new Date().toISOString(),
            });
        setEditing(false);
        setValue(value);
        if (onClose)
            (field == "name") ? onClose(value) : onClose(member.name);
    }

    function handleCancel() {
        setValue("");
        setEditing(false);
    }

    // --- VIEW MODE ---
    if (!editing) {
        return (
            <div className="flex gap-2 items-center">
                <span className={`${className} min-w-30`}>
                    {value || "No value"}
                </span>
                <button
                    onClick={() => { setEditing(true); setValue(member[field as keyof Member] as string || "") }}
                    className="material-symbols-outlined text-slate-400 cursor-pointer"
                >
                    edit
                </button>
            </div>)
    }

    // --- EDIT MODE ---
    return (
        <Modal title={`Edit ${field}`} onClose={handleCancel} isOpen={editing}>
            <div className="flex flex-col p-4 my-2">
                <input
                    type="text"
                    className="outline-none border border-(--gray) p-2 rounded  m-2 font-medium"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
                <div className="flex gap-3">
                    <button
                        onClick={handleSave}
                        className="bg-(--primary) text-white px-4 py-2 rounded mx-auto"
                    >
                        Save
                    </button>
                </div>
            </div>
        </Modal>
    );
}

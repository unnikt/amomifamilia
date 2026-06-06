"use client";

import { deleteObject, ref } from "firebase/storage";
import { doc, deleteDoc } from "firebase/firestore";
import { storage, db } from "@/lib/client/firebaseClient";
import { useRouter } from "next/navigation";
import { DB_MEMBERS } from "@/lib/const/database";
import { useState } from "react";
import Modal from "./Modal";
import EditMember from "./EditMember";
import { Member } from "@/lib/definitions";

export default function ManageMember({ id, member }: { id: string; member: Member }) {
    const router = useRouter();
    const [openEdit, setOpenEdit] = useState(false);

    async function handleDelete() {
        // Delete profile picture
        const picRef = ref(storage, `members/${id}_profile.jpg`);
        try {
            await deleteObject(picRef);
        } catch (err) {
            console.warn("No profile picture to delete");
        }

        // Delete Firestore document
        await deleteDoc(doc(db, DB_MEMBERS, id));

        // Redirect
        router.push("/");
    }
    const [showMenu, setShowMenu] = useState(false);

    const handleMarkDeceased = (id: string) => {
        // update your record: alive = "No"
        console.log("Mark deceased:", id);
        setShowMenu(false);
    };

    const handleRemoveFromDB = (id: string) => {
        // delete from Firestore or your DB
        console.log("Remove from DB:", id);
        setShowMenu(false);
    };

    return (
        <div className="relative inline-block text-left">
            <button
                onClick={() => setShowMenu(prev => !prev)}
                className="material-symbols-outlined w-8 text-slate-500"
            >
                more_vert
            </button>

            {showMenu && (
                <div className="absolute right-0 mt-2 w-60 bg-white border border-slate-200 rounded shadow-lg z-10">
                    <button
                        onClick={() => {
                            setOpenEdit(true);
                            setShowMenu(false);
                        }}
                        className="block w-full text-left px-3 py-2 hover:bg-slate-100"
                    >
                        Edit Member
                    </button>
                    <button
                        onClick={() => handleMarkDeceased(id)}
                        className="block w-full text-left px-3 py-2 hover:bg-slate-100"
                    >
                        Mark as deceased
                    </button>

                    <button
                        onClick={() => handleDelete()}
                        className="block w-full text-left px-3 py-2 hover:bg-red-100 text-(--gray)"
                    >
                        Remove from database
                    </button>
                </div>
            )}

            <Modal
                title="Edit Member"
                isOpen={openEdit}
                onClose={() => { setOpenEdit(false); window.location.href = `/members/${id}`; }}
            >
                <div className="space-y-3 text-gray-700 flex-1 p-6 ">
                    <EditMember id={id} member={member} field="name" onClose={(name) => member.name = name} />
                    <EditMember id={id} member={member} field="whoami" />
                    <EditMember id={id} member={member} field="maritalstat" />
                    <EditMember id={id} member={member} field="gender" />
                    <EditMember id={id} member={member} field="dob" />
                </div>
            </Modal>
        </div>
    );
}

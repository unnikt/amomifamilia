"use client";

import { useRef, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/client/firebaseClient";
import { Member } from "@/lib/definitions";
import { DB_MEMBERS } from "@/lib/const/database";
import Modal from "./Modal";

interface Props {
    id: string;
    member: Member;
}
export default function MemberPicture({ id, member }: Props) {
    const [open, setOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState(member.picUrl || "");

    // Trigger hidden file input
    function handleClick() {
        fileInputRef.current?.click();
    }

    // Handle file selection
    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        // Preview immediately
        const localUrl = URL.createObjectURL(file);
        setPreview(localUrl);

        // Upload to Firebase Storage
        const storageRef = ref(storage, `members/${id}_profile.jpg`);
        await uploadBytes(storageRef, file);

        // Get download URL
        const downloadUrl = await getDownloadURL(storageRef);

        // Save to Firestore
        const memberRef = doc(db, DB_MEMBERS, id);
        await updateDoc(memberRef, { picUrl: downloadUrl });

        setPreview(downloadUrl);
    }

    return (
        <div className="flex justify-start gap-2 items-center">
            <div
                onClick={() => setOpen(true)}
                className="cursor-pointer"
            >
                {preview ? (
                    <img
                        src={preview}
                        alt={member.name}
                        className="w-40 h-40 object-cover rounded-md border border-slate-400 mr-2"
                    />
                ) : (
                    <div className="w-40 h-40 bg-gray-200 rounded-md m-0 flex items-center justify-center text-gray-500">
                        Add Picture
                    </div>
                )}
            </div>

            {/* Hidden file input */}
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
            />
            <Modal title="Update Profile Picture" isOpen={open} onClose={() => setOpen(false)}>
                <div className="flex flex-col p-4 ">
                    {preview && <img
                        src={preview}
                        alt="Preview"
                        className="w-100 h-100 object-cover rounded-md border border-slate-400 mx-auto "
                    />
                    }
                    <button
                        onClick={handleClick}
                        className="bg-(--primary) text-white px-4 py-2 m-2 rounded mx-auto"
                    >
                        {preview ? "Change" : "Upload"} picture
                    </button>
                </div>
            </Modal>
        </div>
    );
}

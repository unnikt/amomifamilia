"use client";

import { useRef, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/client/firebaseClient";
import { Member } from "@/lib/definitions";
import { DB_MEMBERS } from "@/lib/const/database";

interface Props {
    id: string;
    member: Member;
}
export default function MemberPicture({ id, member }: Props) {
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
                onClick={handleClick}
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
        </div>
    );
}

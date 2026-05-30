"use client";

import { db, storage } from "@/lib/client/firebaseClient";
import { Member } from "@/lib/definitions";
import { toCamelCase } from "@/lib/string/camelcase";
import { slugify } from "@/lib/string/slugify";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
    onMemberAdded?: () => void;
    isOpen?: (state: boolean) => void;
}
export default function AddMemberForm({ onMemberAdded, isOpen }: Props) {
    const [open, setOpen] = useState(false);
    const [picSelected, setpicSelected] = useState(false);
    const [profilePic, setProfilePic] = useState<string | null>(null);

    const [mem, setMem] = useState<Member>({
        name: "",
        gender: "Male",
        dob: "",
        whoami: "",
        maritalstat: "Single",
        picUrl: null,
    });
    const router = useRouter();

    useEffect(() => {
        const auth = getAuth();

        const unsub = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("User logged in:", user.uid);
            } else {
                console.log("No user logged in");
                router.push("/auth/login")

            }
        });

        return () => unsub();
    }, []);

    function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setProfilePic(url);

            setMem((prev) => ({
                ...prev,
                picUrl: file,
            }));
            setpicSelected(true);
        }
    }
    function handleOpen() {
        setOpen(true);
        if (isOpen) isOpen(true);
    }
    function handleDeletePic() {
        setProfilePic(null);

        setMem((prev) => ({
            ...prev,
            picUrl: null,
        }));

        // Reset the file input
        const fileInput = document.getElementById("profilePicInput") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
        setpicSelected(false);
    }

    async function handleSave() {
        try {
            console.log("Saving member:", mem);

            let picUrl = "";

            // Upload profile picture if exists..
            if (mem.picUrl) {
                const storageRef = ref(storage, `members/${Date.now()}_${slugify(mem.name)}`);
                await uploadBytes(storageRef, mem.picUrl);
                picUrl = await getDownloadURL(storageRef);
            }

            // Prepare Firestore document
            const docData = {
                name: toCamelCase(mem.name),
                gender: mem.gender,
                dob: mem.dob,
                whoami: mem.whoami,
                maritalstat: mem.maritalstat,
                picUrl: picUrl,
                createdAt: new Date().toISOString(),
            };

            // Save to Firestore
            const docRef = await addDoc(collection(db, "members"), docData);

            console.log("Saved Member with ID:", docRef.id);
            router.push(`/members/${mem.name}`)

        } catch (error) {
            console.error("Error saving member:", error);
            alert("Failed to save member");
        }
    }

    return (
        <div className="mx-auto  sm:min-w-3xl sm:mt-3">
            {!open && (
                <div className="w-fit mx-auto">
                    <button
                        className="flex flex-col gap-2 bg-(--primary) p-4 text-white m-2 rounded shadow-lg"
                        onClick={handleOpen}
                    >
                        <span
                            className="material-symbols-outlined btn-material-icons">
                            person_add
                        </span>
                        <span>
                            Add a member
                        </span>
                    </button>
                </div>
            )}

            {open && (
                <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6 space-y-4">
                    <div className="flex justify-between">
                        <h2 className="title">Add New Member</h2>
                        <span
                            className="material-symbols-outlined btn-material-icons"
                            onClick={() => { setOpen(false); if (isOpen) isOpen(false); }}
                        >
                            close
                        </span>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            className="w-full border rounded p-2"
                            placeholder="Enter name"
                            onChange={(e) => {
                                setMem((prev) => ({ ...prev, name: e.target.value }))
                            }}
                        />
                    </div>

                    {/* Who am I */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Who am I</label>
                        <input
                            type="text"
                            className="w-full border rounded p-2"
                            placeholder="Doctor, Engineer, Singer..."
                            onChange={(e) =>
                                setMem((prev) => ({ ...prev, whoami: e.target.value }))
                            }
                        />
                    </div>

                    {/* Gender */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Gender</label>
                        <div className="flex gap-6 mt-1">
                            {["Male", "Female", "Other"].map((g) => (
                                <label key={g} className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value={g}
                                        onChange={() =>
                                            setMem((prev) => ({ ...prev, gender: g as Member["gender"] }))
                                        }
                                    />
                                    <span>{g}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Profile Pic */}
                    <div className="flex justify-center items-center">
                        {!picSelected &&
                            <div className="mt-1">
                                <label
                                    htmlFor="profilePicInput"
                                    className="inline-flex items-center gap-2 px-3 py-2 bg-(--secondary)/80 text-white rounded cursor-pointer hover:opacity-90"
                                >
                                    <span className="material-symbols-outlined">upload</span>
                                    <span>Upload Profile Picture</span>
                                </label>

                                <input
                                    id="profilePicInput"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImage}
                                    className="hidden"
                                />
                            </div>}

                        {profilePic && (
                            <img
                                src={profilePic}
                                alt="Preview"
                                className="w-32 h-32 object-cover rounded-md border"
                            />
                        )}
                        {picSelected && <span
                            className="material-symbols-outlined btn-material-icon text-slate-400! cursor-pointer"
                            onClick={handleDeletePic}
                        >
                            delete
                        </span>}
                    </div>

                    {/* DOB */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Date of Birth
                        </label>
                        <input
                            type="date"
                            className="w-full border rounded p-2"
                            onChange={(e) =>
                                setMem((prev) => ({ ...prev, dob: e.target.value }))
                            }
                        />
                    </div>

                    {/* Marital Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Marital Status
                        </label>
                        <select
                            className="w-full border rounded p-2"
                            onChange={(e) =>
                                setMem((prev) => ({ ...prev, maritalstat: e.target.value as Member["maritalstat"] }))
                            }
                        >
                            <option>Single</option>
                            <option>Married</option>
                            <option>Divorced</option>
                            <option>Widowed</option>
                        </select>
                    </div>

                    {/* Submit */}
                    <button
                        className="w-full bg-(--primary) text-(--text) py-2 rounded hover:bg-blue-700"
                        onClick={handleSave}
                    >
                        Save Member
                    </button>
                </div>
            )}
        </div>
    );
}

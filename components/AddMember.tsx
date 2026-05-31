"use client";

import { db, storage } from "@/lib/client/firebaseClient";
import { Member } from "@/lib/definitions";
import { toCamelCase } from "@/lib/string/camelcase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import PhoneInput from "./PhoneInput";

interface Props {
    onMemberAdded?: () => void;
    isOpen?: (state: boolean) => void;
}
export default function AddMemberForm({ onMemberAdded, isOpen }: Props) {
    const [open, setOpen] = useState(false);
    const [missing, setMissing] = useState(false);
    const [picSelected, setpicSelected] = useState(false);
    const [profilePic, setProfilePic] = useState<string | null>(null);
    const [phone, setPhone] = useState("");
    const [gender, setGender] = useState("");

    const [mem, setMem] = useState<Member>({
        name: "",
        gender: "Male",
        dob: "",
        phone: "",
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
            mem.gender = gender as Member["gender"];
            console.log("Saving member:", mem, gender);

            if (!mem.name || mem.name == "") { setMissing(true); return; };
            if (!mem.gender) { setMissing(true); return; };
            setMissing(false);

            let picUrl = "";

            // Prepare Firestore document
            const docData = {
                name: toCamelCase(mem.name),
                gender: gender,
                dob: mem.dob,
                phone: phone,
                whoami: mem.whoami,
                maritalstat: mem.maritalstat,
                picUrl: picUrl,
                createdAt: new Date().toISOString(),
            };


            // Save to Firestore
            const docRef = await addDoc(collection(db, "members"), docData);

            // Upload profile picture if exists.
            if (mem.picUrl) {
                const storageRef = ref(storage, `members/${docRef.id}_profile.jpg`);
                await uploadBytes(storageRef, mem.picUrl);
                picUrl = await getDownloadURL(storageRef);

                // 3️⃣ Update Firestore with the REAL picUrl
                await updateDoc(docRef, { picUrl });
            }

            console.log("Saved Member with ID:", docRef.id);
            router.push(`/members/${mem.name}`)

        } catch (error) {
            console.error("Error saving member:", error);
            alert("Failed to save member");
        }
    }

    return (
        <div className="mx-auto  ">
            {!open && (
                <div className="w-full mx-auto">
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
                <div className="max-w-lg mx-auto bg-white shadow-md border border-slate-300 rounded-lg p-4  space-y-4">
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
                        <label className="block text-sm font-medium text-gray- 700">
                            Name {missing && <span className="text-red-500"> *required</span>}
                        </label>
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
                        <label className="block text-sm font-medium text-gray-700">I am a</label>
                        <input
                            type="text"
                            className="w-full border rounded p-2"
                            onChange={(e) =>
                                setMem((prev) => ({ ...prev, whoami: e.target.value }))
                            }
                        />
                        <span
                            className="text-sm text-slate-500 italic"
                        >e.g..Actor, Doctor, Dancer, Cat lover, Chef, Mom, Traveller...   </span>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <PhoneInput value={phone} onChange={setPhone} />
                    </div>

                    <div className="flex justify-between gap-2">
                        <div className="flex flex-col gap-2">
                            {/* Gender */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Gender
                                    {missing && <span className="text-red-500"> *required</span>}
                                </label>
                                <div className="flex gap-1 border p-2 rounded ">
                                    {["Male", "Female", "Other"].map((g) => (
                                        <label key={g} className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value={g}
                                                checked={gender === g}
                                                onChange={() =>
                                                    setGender(g as Member["gender"])
                                                }
                                            />
                                            <span>{g}</span>
                                        </label>
                                    ))}
                                </div>
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
                        </div>


                        {/* Profile Pic */}
                        <div className="flex items-center">
                            {!picSelected &&
                                <div className="mt-1">
                                    <label
                                        htmlFor="profilePicInput"
                                        className="h-32 w-32 mr-2  inline-flex items-center gap-2 p-3  bg-slate-400 text-white rounded cursor-pointer hover:opacity-90"
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
                                    className="w-32 h-32 mr-2 object-cover rounded-md border border-slate-400"
                                />
                            )}
                            {picSelected && <span
                                className="material-symbols-outlined  text-slate-400! cursor-pointer"
                                onClick={handleDeletePic}
                            >
                                delete
                            </span>}
                        </div>
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

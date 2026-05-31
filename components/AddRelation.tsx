"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/client/firebaseClient";
import {
    collection,
    getDocs,
    doc,
    updateDoc,
    arrayUnion,
    getDoc,
} from "firebase/firestore";
import { Member } from "@/lib/definitions";
import { getMembersByName } from "@/app/api/getMembersByName";
import { useRouter } from "next/navigation";
import getReverseRelation from "./getReverseRelation";

const RELATIONS = [
    "Father",
    "Mother",
    "Brother",
    "Sister",
    "Son",
    "Daughter",
    "Wife",
    "Husband",
];


interface Props {
    memberId: string;
    name: string;
    gender: string;
    onClose?: () => void;
}
export default function AddRelation({ memberId, name, gender, onClose }: Props) {
    const [members, setMembers] = useState<(Member & { id: string })[]>([]);
    const [selectedMember, setSelectedMember] = useState("");
    const [relation, setRelation] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState<(Member & { id: string })[]>([]);
    const router = useRouter();

    useEffect(() => {
        async function loadMembers() {
            const snap = await getDocs(collection(db, "members")); // lowercase
            const list = snap.docs.map((d) => ({
                id: d.id,
                ...(d.data() as Member),
            }));

            // exclude the current member
            setMembers(list.filter((m) => m.id !== memberId));
        }

        loadMembers();
    }, [memberId]);

    async function handleSave() {
        if (!selectedMember || !relation) {
            alert("Please select both member and relation");
            return;
        }

        const mainRef = doc(db, "members", memberId);
        const otherRef = doc(db, "members", selectedMember);

        // Fetch gender of the other member
        const otherSnap = await getDoc(otherRef);
        const otherMember = otherSnap.data() as Member;

        // Determine reverse relation based on gender
        const reverse = getReverseRelation(relation, gender);
        console.log(relation, otherMember.gender, reverse, gender);

        // 1. Add relation to main member
        await updateDoc(mainRef, {
            relations: arrayUnion({
                memberId: selectedMember,
                type: relation,
            }),
        });

        // 2. Add reverse relation to the other member
        await updateDoc(otherRef, {
            relations: arrayUnion({
                memberId: memberId,
                type: reverse,
            }),
        });

        router.push(`/members/${name}`);
    }

    return (
        <div className="p-2 space-y-1 border border-slate-300 rounded p-4">
            <div className="flex justify-between items-center py-2">
                <h3 className="text-lg font-semibold mb-1">Add relation</h3>
                <button
                    className="material-symbols-outlined text-(--primary)/70"
                    onClick={() => { if (onClose) onClose(); }}
                >
                    close
                </button>
            </div>
            {/* Select Relation */}
            <div>
                <select
                    className="mt-1 w-full border rounded p-2"
                    value={relation}
                    onChange={(e) => setRelation(e.target.value)}
                >
                    <option value="">Choose relation</option>
                    {RELATIONS.map((r) => (
                        <option key={r} value={r}>
                            {r}
                        </option>
                    ))}
                </select>
            </div>

            {/* Search Member */}
            <div className="relative">
                <input
                    type="text"
                    className="mt-1 w-full border rounded p-2"
                    placeholder="Search a name..."
                    value={searchTerm}
                    onChange={async (e) => {
                        const value = e.target.value;
                        setSearchTerm(value);

                        if (value.trim().length === 0) {
                            setSuggestions([]);
                            return;
                        }

                        const results = await getMembersByName(value);
                        setSuggestions(results);
                    }}
                />

                {/* Suggestions dropdown */}
                {suggestions.length > 0 && (
                    <ul className="absolute z-10 bg-white border w-full mt-1 rounded shadow max-h-48 overflow-auto">
                        {suggestions.map((m) => (
                            <li
                                key={m.id}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                    setSelectedMember(m.id);
                                    setSearchTerm(m.name);
                                    setSuggestions([]);
                                }}
                            >
                                {m.name}{" "}
                                <span className="text-gray-500 text-sm">({m.whoami})</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <button
                onClick={handleSave}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
                Save Relation
            </button>
        </div>
    );
}

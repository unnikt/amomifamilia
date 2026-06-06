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
    query,
    where,
} from "firebase/firestore";
import { Member, RelationType } from "@/lib/definitions";
import { useRouter } from "next/navigation";
import getReverseRelation from "./getReverseRelation";
import { DB_MEMBERS } from "@/lib/const/database";
import Modal from "./Modal";
import getGender from "@/lib/member/reverseRelation";

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
    member: Member;
    name: string;
    gender: string;
    onClose?: () => void;
}
export default function AddRelation({ memberId, member, name, gender, onClose }: Props) {
    const families = member.families || [];
    const [open, setOpen] = useState(true);
    const [message, setMessage] = useState("");
    const [members, setMembers] = useState<(Member & { id: string })[]>([]);
    const [selectedFamily, setSelectedFamily] = useState("");
    const [selectedMember, setSelectedMember] = useState("");
    const [relation, setRelation] = useState<RelationType | "">("");
    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState<({ id: string, name: string, whoami: string })[]>([]);
    const router = useRouter();

    useEffect(() => {
        async function loadMembers() {
            // Get Families of the current user to filter members
            const q = query(
                collection(db, DB_MEMBERS),
                where("families", "array-contains", selectedFamily),
            );

            const snap = await getDocs(q); // lowercase
            const list = snap.docs.map((d) => ({
                id: d.id,
                ...(d.data() as Member),
            }));

            // exclude the current member
            setMembers(list.filter((m) => m.id !== memberId));

        }
        loadMembers();
    }, [selectedFamily]);


    async function handleSave() {
        setMessage("");
        if (!selectedFamily || !selectedMember || !relation) {
            setMessage("Please select family,member and relation");
            return;
        }

        const mainRef = doc(db, DB_MEMBERS, memberId);
        const otherRef = doc(db, DB_MEMBERS, selectedMember);

        // Fetch gender of the other member
        const otherSnap = await getDoc(otherRef);
        const otherMember = otherSnap.data() as Member;

        // Determine reverse relation based on gender
        const reverse = getReverseRelation(relation, otherMember.gender);
        console.log(otherMember.name, otherMember.gender, "is ", relation, " of ", member.name, gender, "is ", reverse,);

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

        setMessage("Relation added successfully!");
        router.push(`/members/${member.name}`);
    }

    return (
        <Modal onClose={onClose} title="Add Relation" isOpen={open} h="h-screen">
            <div className="space-y-4 border border-slate-300 rounded p-4">
                <select
                    className="mt-1 w-full border rounded p-2"
                    value={selectedFamily}
                    onChange={(e) => { setSelectedFamily(e.target.value); setMessage(""); }}
                >
                    <option value="">Choose family</option>
                    {families.map((f) => (
                        <option key={f} value={f}>
                            {f}
                        </option>
                    ))}
                </select>
                <select
                    className="mt-1 w-full border rounded p-2"
                    value={relation}
                    onChange={(e) => { setRelation(e.target.value as RelationType); setMessage(""); }}
                >
                    <option value="">Choose relation</option>
                    {RELATIONS.map((r) => (
                        <option key={r} value={r}>
                            {r}
                        </option>
                    ))}
                </select>

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

                            if (value.trim().length < 3) {
                                setSuggestions([]);
                                return;
                            }

                            // Filter members based on the Gender of the relation selected
                            const g = getGender(relation as RelationType);
                            const filtered = members.filter((m) => m.gender === g && m.name.toLowerCase().includes(value.toLowerCase()));
                            const suggs = filtered.map((m) => ({ id: m.id, name: m.name, whoami: m.whoami }));
                            setSuggestions(suggs);
                            console.log(suggs);
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
                                    {m.whoami && <span className="text-gray-500 text-sm">({m.whoami})</span>}
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
                {message && <div className="text-red-500">{message}</div>}

            </div>
        </Modal>

    );
}

"use client"
import AddRelation from "@/components/AddRelation";
import { db } from "@/lib/client/firebaseClient";
import { DB_MEMBERS } from "@/lib/const/database";
import { Member } from "@/lib/definitions";
import { getMembersByIds } from "@/lib/getMembersById";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
    id: string;
    member: Member;
    delink?: boolean;
    onDelink?: (delinked: boolean) => void;
}
export default function RelationsClient({ id, member, delink = false, onDelink }: Props) {
    const router = useRouter();
    const [show, setShow] = useState(true)
    const [loading, setLoading] = useState(false)
    const [relations, setRelations] = useState<
        { id: string; name: string; type: string }[]
    >([]);

    const priority: Record<string, number> = {
        father: 1,
        mother: 2,
        husband: 3,
        wife: 3,
        sibling: 4,
        child: 5,
    };


    useEffect(() => {
        async function loadRelations() {
            if (!member?.relations) return;
            setLoading(true);
            const ids = member.relations.map((r: any) => r.memberId);
            const relatedMembers = await getMembersByIds(ids);

            const merged = member.relations.map((r: any) => {
                const match = relatedMembers.find((m) => m.id === r.memberId);
                return {
                    id: r.memberId,
                    type: r.type,
                    name: match?.name || "Unknown",
                };
            });

            const sorted = [...merged].sort((a, b) => {
                const pa = priority[a.type.toLowerCase()] ?? 999;
                const pb = priority[b.type.toLowerCase()] ?? 999;
                return pa - pb;
            });
            setRelations(sorted);
            setLoading(false);
        }

        loadRelations();
    }, [member]);

    async function onDeleteRelation(idx: number) {
        const r = relations[idx];

        const currentRef = doc(db, DB_MEMBERS, id);
        // Remove from current member
        await updateDoc(currentRef, {
            relations: arrayRemove({
                memberId: r.id,
                type: r.type,
            }),
        }).then(() => {
            router.push(`/members/${id}`)
        });

        onDelink?.(true)
    }


    return (
        <div>
            {/* Relations Section */}
            {show ?
                < div className="p-2" >
                    {!delink && <div className="flex justify-items-start  items-start gap-6 py-2">
                        <h3 className="text-lg text-(--gray) font-semibold mb-1">Family</h3>
                        <button
                            className="material-symbols-outlined text-(--primary)/70 w-8 ml-5"
                            onClick={() => setShow(false)}
                        >
                            person_add
                        </button>
                    </div>

                    }
                    <div className="flex">
                        {loading ? <p className="text-gray-500 text-sm">loading...</p> :
                            relations.length === 0 && (
                                <p className="text-gray-500 text-sm">No relations added.</p>
                            )
                        }
                        <ul className="space-y-1">
                            {relations.map((r, idx) => (
                                <li
                                    key={r.id}
                                    className="flex justify-between items-center gap-2 sm:gap-8"
                                >
                                    {/* Left side: relation type + link */}
                                    {/* <div className="flex flex-col"> */}
                                    <span className="font-medium w-18 text-(--gray)">{r.type}</span>
                                    <Link
                                        href={`/members/${r.id}`}
                                        className="text-blue-600 hover:underline text-sm flex-1"
                                    >
                                        {r.name}
                                    </Link>
                                    {/* </div> */}

                                    {/* Delete button */}
                                    {delink &&
                                        < button
                                            onClick={() => onDeleteRelation(idx)}
                                            className="material-symbols-outlined text-(--gray)   w-8 "
                                        >
                                            link_off
                                        </button>
                                    }
                                </li>
                            ))}
                        </ul>
                    </div >
                </div>
                :
                <AddRelation
                    memberId={id} member={member} name={member.name} gender={member.gender}
                    onClose={() => setShow(true)} />
            }
        </div >
    )
}
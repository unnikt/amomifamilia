"use client"
import { Member } from "@/lib/definitions";
import { getMembersByIds } from "@/lib/getMembersById";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Props {
    member: Member;
}
export default function RelationsClient({ member }: Props) {
    const [relations, setRelations] = useState<
        { id: string; name: string; type: string }[]
    >([]);

    useEffect(() => {
        async function loadRelations() {
            if (!member?.relations) return;

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

            setRelations(merged);
        }

        loadRelations();
    }, [member]);


    return (
        <div>
            {/* Relations Section */}
            < div className=" p-2 bg-gray-50 " >
                <h3 className="text-lg font-semibold mb-1">Family</h3>

                {
                    relations.length === 0 && (
                        <p className="text-gray-500 text-sm">No relations added.</p>
                    )
                }

                <ul className="space-y-1">
                    {relations.map((r) => (
                        <li key={r.id} className="flex justify-between items-center">
                            <span className="font-medium">{r.type}</span>

                            <Link
                                href={`/members/${r.name}`}
                                className="text-blue-600 hover:underline text-sm"
                            >
                                {r.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div >
        </div>
    )
}
"use client";

import { useEffect, useState } from "react";
import { getMembers } from "@/lib/getMembers";
import { Member } from "@/lib/definitions";
import Link from "next/link";

interface Props {
    refreshKey: number;
}
export default function MemberList({ refreshKey }: Props) {
    const [members, setMembers] = useState<(Member & { id: string })[]>([]);
    const [loading, setLoading] = useState(true);

    async function loadMembers() {
        setLoading(true);
        const data = await getMembers();
        setMembers(data);
        setLoading(false);
    }

    useEffect(() => {
        loadMembers();
    }, [refreshKey]);

    if (loading) {
        return <p className="text-center text-gray-500 mt-6">Loading members…</p>;
    }

    if (members.length === 0) {
        return <p className="text-center text-gray-500 mt-6">No members found.</p>;
    }

    return (
        <div className="flex flex-wrap max-w-xl mx-auto mt-4 gap-2 px-2 w-fit">
            {members.map((m) => (
                <Link
                    href={`/members/${m.name}`}
                    key={m.id}
                    className="flex items-center gap-4 p-4 bg-white shadow rounded-lg border border-slate-300"
                >
                    {/* Profile Picture */}
                    {m.picUrl ? (
                        <img
                            src={m.picUrl}
                            alt={m.name}
                            className="w-16 h-16 rounded-md object-cover border"
                        />
                    ) : (
                        <div className="w-16 h-16 rounded-md bg-gray-200 flex items-center justify-center text-gray-500">
                            No Pic
                        </div>
                    )}

                    {/* Member Info */}
                    <div>
                        <p className="font-semibold text-lg">{m.name}</p>
                        <p className="text-sm text-gray-600">{m.whoami}</p>
                        <p className="text-sm text-gray-600">{m.gender}</p>
                        <p className="text-sm text-gray-600">{m.maritalstat}</p>
                    </div>
                </Link>
            ))}
        </div>
    );
}

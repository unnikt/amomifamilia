"use client";

import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getMyFamilies } from "@/lib/firestore/getMyFamilies";
import Link from "next/link";
import { Family } from "@/lib/definitions";

export default function FamilyListPage() {
    const [families, setFamilies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth();

        const unsub = auth.onAuthStateChanged(async (user) => {

            if (!user) {
                setLoading(false);
                return;
            }

            const data = await getMyFamilies(user.uid);
            const parents = data.filter(f => { if (!f.parents) return f });
            setFamilies(parents);
            setLoading(false);
        });

        return () => unsub();
    }, []);

    if (loading) {
        return <p className="text-center mt-10">Loading families…</p>;
    }

    if (families.length === 0) {
        return (
            <div className="text-center mt-10">
                <p className="text-gray-600">You haven’t created any families yet.</p>
            </div>
        );
    }

    return (
        <div className="max-w-lg px-6">
            <h1 className="text-2xl font-semibold mb-4">Your Families</h1>
            <Link
                href="/family/new"
                className="text-(--primary)  p-2 inline-block">
                Create a family
            </Link>

            <div className="flex flex-col gap-2">
                {families.map((fam) => (
                    <Link
                        href={`/family/${fam.id}`}
                        key={fam.id}
                        className="p-2 border-b border-b-gray-300"
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-medium">{fam.name}</h2>
                            <span
                                className="material-symbols-outlined text-(--primary) text-sm">
                                chevron_forward
                            </span>
                        </div>

                        {fam.code && (
                            <p className="text-sm text-gray-600 mt-1">
                                Family Code: <span className="font-mono">{fam.code}</span>
                            </p>
                        )}

                        <p className="text-sm text-gray-500 mt-2">
                            Sub families: {fam.subfamilies?.length ?? 0}
                        </p>
                    </Link>
                ))}
            </div>

        </div>
    );
}

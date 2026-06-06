"use client"

import AddMemberForm from "@/components/AddMember"
import MemberSearch from "@/components/MemberSearch"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function HomeClient() {
    const [refreshKey, setRefreshKey] = useState(0);
    const [open, setOpen] = useState(false);
    const router = useRouter();

    function handleMemberAdded() {
        setRefreshKey(prev => prev + 1)   // triggers re-render + reload
        setOpen(false)
    }
    return (
        <div className="flex flex-col justify-start align-middle gap-2 p-2 rounded h-screen">
            <div className="w-fit mx-auto rounded">
                {!open &&
                    <div className="flex flex-col gap-4 items-center">
                        <img src="/famili.svg"
                            className="w-60 mb-6" />

                        <p className="title text-center">Search a member</p>
                        <MemberSearch onSelect={(name) => router.push(`/members/${name}`)} />

                        <Link
                            href="/family"
                            className="text-(--primary) ">
                            My families
                        </Link>
                        <Link
                            href="/family/new"
                            className="text-(--primary)">
                            Create a family
                        </Link>
                        {/* <Link
                            href="/members/bulkupload"
                            className="text-(--primary)">
                            Bulk upload Members
                        </Link> */}
                    </div>}
                <div className="flex flex-col gap-4  mt-4">
                    <AddMemberForm isOpen={(b) => setOpen(b)} onMemberAdded={handleMemberAdded} />
                </div>
            </div>
        </div>
    )
}
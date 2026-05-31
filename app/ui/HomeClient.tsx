"use client"

import AddMemberForm from "@/components/AddMember"
import MemberSearch from "@/components/MemberSearch"
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
            {!open &&
                <div className="w-fit mx-auto rounded">
                    <img src="/famili.svg"
                        className="w-60 mb-3" />

                    <p className="title text-center">Search a member</p>
                    <MemberSearch onSelect={(name) => router.push(`/members/${name}`)} />

                </div>
            }
            <AddMemberForm isOpen={(b) => setOpen(b)} onMemberAdded={handleMemberAdded} />
            {/* <MemberList refreshKey={refreshKey} /> */}
        </div>
    )
}
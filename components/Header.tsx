"use client"
import { useRef, useState } from "react";
import Link from "next/link";
import MainMenu from "./MenuMain";
import { useRouter } from "next/navigation";
import UserAvatarLink from "./useAvatarLink";


export default function Header() {
    const router = useRouter();   // App Router hook

    const [open, setOpen] = useState(false)
    const menuRef = useRef(null);
    return (
        <div>
            <div className="p-2 flex justify-between items-center bg-(--primary)">
                <div ref={menuRef} className="relative">
                    <span
                        className="material-symbols-outlined btn-material-icon"
                        onClick={() => setOpen(prev => !prev)}>menu</span>

                    {open && <MainMenu onClose={() => setOpen(false)} />}
                </div>
                <Link href="/"
                    className="flex gap-1 items-center">
                    <span className="material-symbols-outlined btn-material-icon">family_group</span>
                    <h2 className="text-2xl font-semibold tracking-tight text-(--text)">
                        Familia
                    </h2>
                </Link>
                <div className="flex justify-between items-center gap-2">
                    <UserAvatarLink />
                </div>
            </div>
            <div className="flex justify-center p-2">
                <button
                    className="material-symbols-outlined rounded text-(--primary)"
                    onClick={() => router.back()}>
                    reply
                </button>
            </div>
        </div >
    )
}

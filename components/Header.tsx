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
        <div >
            <div className="p-2 flex justify-between items-center bg-(--primary)">
                {/* <div ref={menuRef} className="relative hidden">
                    <span
                        className="material-symbols-outlined btn-material-icon"
                        onClick={() => setOpen(prev => !prev)}>menu</span>

                    {open && <MainMenu onClose={() => setOpen(false)} />}
                </div> */}
                <Link href="/"
                    className="flex gap-2 items-center">
                    <span className="material-symbols-outlined btn-material-icon">family_group</span>
                    <h2 className="text-2xl  tracking-wide text-(--text)">
                        Mi Famili
                    </h2>
                </Link>
                <div className="flex justify-between items-center gap-2">
                    <UserAvatarLink />
                </div>
            </div>
            <div className="flex justify-center p-2 bg-slate-100">
                <button
                    className="material-symbols-outlined rounded text-(--primary)"
                    onClick={() => router.back()}>
                    reply
                </button>
            </div>
        </div >
    )
}

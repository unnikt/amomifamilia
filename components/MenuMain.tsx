import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { AdminMenu, UserMenu } from "@/lib/const/Menu";

interface Props {
    onClose?: () => void;
}
export default function MainMenu({ onClose }: Props) {
    const [open, setOpen] = useState(true);
    const [isAdmin, setAdmin] = useState(false);
    const { user, loading, rights } = useUser();

    useEffect(() => {
        if (loading) return;
        if (user && rights.includes('admin')) setAdmin(true);
    })

    function handleClick() {
        setOpen(false);
        const saved = localStorage.getItem("theme");
        if (saved) {
            document.documentElement.classList.toggle("dark", saved === "dark");
        }
        onClose?.();
    }

    return (
        open && (
            <div className="bg-(--primary) fixed top-0 left-0 shadow  min-w-30 z-50 w-[60vw] sm:w-[20vw] h-screen overflow-y-auto">
                <div className="flex p-2">
                    <button className="material-symbols-outlined btn-material-icon text-(--text)"
                        onClick={handleClick} >
                        menu
                    </button>
                </div>
                <div className="px-4">
                    <div className="flex flex-col gap-3 border-t border-t-(--text)/40 mt-2 mb-3 px-2">
                        <p className="text-(--text)/70 mt-2">Menu</p>
                        {UserMenu.map(link => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={handleClick}
                                className="text-(--primary) pl-4"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                    <div className="pl-6">
                        <ThemeToggle onClick={handleClick} />
                    </div>

                    {isAdmin &&
                        <div className="flex flex-col gap-3 border-t border-t-(--text)/40 mt-2 mb-3 px-2">
                            <p className="text-(--text)/70 mt-2">Admin</p>
                            <div className="flex flex-col gap-3 ">
                                {AdminMenu.map(link => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={handleClick}
                                        className="text-(--primary) pl-4"
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    }

                </div>
            </div>
        )
    );
}

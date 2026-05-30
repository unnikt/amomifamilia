"use client";
import { useEffect, useState } from "react";

interface Props {
    onClick?: () => void;
}
export default function ThemeToggle({ onClick }: Props) {
    const [dark, setDark] = useState<boolean | null>(null);

    // Load saved theme OR fallback to DOM state
    useEffect(() => {
        const saved = localStorage.getItem("theme");

        if (saved === "dark") {
            document.documentElement.classList.remove("light");
            document.documentElement.classList.add("dark");
            setDark(true);
            return;
        }

        if (saved === "light") {
            document.documentElement.classList.remove("dark");
            document.documentElement.classList.add("light");
            setDark(false);
            return;
        }

        // No saved theme → sync with DOM (your original logic)
        // const isDark = document.documentElement.classList.contains("dark");
        // setDark(true); // default to dark if no preference
    }, []);

    // // Apply theme + persist
    // useEffect(() => {
    //     if (dark === null) return;
    //     document.documentElement.classList.toggle("dark", dark);
    //     localStorage.setItem("theme", dark ? "dark" : "light");
    // }, [dark]);

    if (dark === null) return null; // avoid hydration mismatch


    function handleClick() {
        localStorage.setItem("theme", !dark ? "dark" : "light");
        onClick?.();
    }


    return (
        <button
            onClick={handleClick}
            className="flex items-center gap-2 w-full text-(--primary) rounded"
        >
            {dark ? "Light" : "Dark"}
            <span className="material-symbols-outlined">
                {dark ? "dark_mode" : "clear_day"}

            </span>
        </button>
    );
}

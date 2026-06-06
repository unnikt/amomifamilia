"use client"
import { getFamiliesByName } from "@/app/api/getfamilyData";
import { Family } from "@/lib/definitions";
import { useState } from "react";
interface Props {
    onSelect?: ({ id, name }: { id: string, name: string }) => void;
}
export default function FamilySearch({ onSelect }: Props) {
    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState<(Family & { id: string })[]>([]);

    return (
        <div className="mx-auto w-fit min-w-0">
            <input
                type="text"
                className="mt-2 mx-auto border rounded p-2 outline-0 border-(--secondary) focus:border-(--primary)"
                placeholder="Type a name..."
                value={searchTerm}
                onChange={async (e) => {
                    const value = e.target.value;
                    setSearchTerm(value);

                    if (value.trim().length === 0) {
                        setSuggestions([]);
                        return;
                    }

                    const results = await getFamiliesByName(value);
                    setSuggestions(results);
                }}
            />
            {/* Suggestions dropdown */}
            {suggestions.length > 0 && (
                <ul className="absolute z-10 bg-white border w-fit mt-1 rounded shadow max-h-48 overflow-auto">
                    {suggestions.map((f) => (
                        <li
                            key={f.id}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                                setSearchTerm(f.name);
                                setSuggestions([])
                                if (onSelect) onSelect({ id: f.id, name: f.name });
                            }}
                        >
                            {f.name}{" "}
                        </li>
                    ))}
                </ul>
            )}

        </div>
    )
}


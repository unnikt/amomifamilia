import { getMembersByName } from "@/app/api/getMembersByName";
import { Member } from "@/lib/definitions";
import { useState } from "react";

interface Props {
    onSelect?: (str: string) => void;
}
export default function MemberSearch({ onSelect }: Props) {
    const [selectedMember, setSelectedMember] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState<(Member & { id: string })[]>([]);


    return (
        <div>
            {/* Search Member */}
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

                        const results = await getMembersByName(value);
                        setSuggestions(results);
                    }}
                />

                {/* Suggestions dropdown */}
                {suggestions.length > 0 && (
                    <ul className="absolute z-10 bg-white border w-fit mt-1 rounded shadow max-h-48 overflow-auto">
                        {suggestions.map((m) => (
                            <li
                                key={m.id}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                    setSelectedMember(m.id);
                                    setSearchTerm(m.name);
                                    setSuggestions([]);
                                    if (onSelect) onSelect(m.id);
                                }}
                            >
                                {m.name}{" "}
                                <span className="text-gray-500 text-sm">({m.whoami})</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}
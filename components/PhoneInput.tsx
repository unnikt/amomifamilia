"use client";

import { useState } from "react";

export default function PhoneInput({ value, onChange }: {
    value: string;
    onChange: (v: string) => void;
}) {
    const [error, setError] = useState("");

    function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
        // Allow + only at the start, digits after
        let raw = e.target.value;

        // Remove everything except digits and +
        raw = raw.replace(/[^+\d]/g, "");

        // Ensure + only appears at the beginning
        if (raw.includes("+")) {
            raw = "+" + raw.replace(/\+/g, "").replace(/[^\d]/g, "");
        }

        // Limit total length (e.g., +61412345678)
        if (raw.length > 16) return;

        // Basic validation
        if (raw.length < 8) {
            setError("Phone number seems too short");
        } else {
            setError("");
        }

        onChange(raw);
    }

    return (
        <div className="flex flex-col gap-1">
            <input
                type="tel"
                value={value}
                onChange={handleInput}
                placeholder="Enter phone number"
                className="border rounded px-3 py-2 w-40"
            />

            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}

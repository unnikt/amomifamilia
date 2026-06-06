"use client";

import { useRef, useState } from "react";
import Papa from "papaparse";

type BulkMember = {
    name: string;
    gender: "Male" | "Female" | "Other";
    family: string;
    alive: "yes" | "no";
};

export default function BulkUploadMembers() {
    const [rows, setRows] = useState<BulkMember[]>([]);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => {
                const parsed = result.data as BulkMember[];
                console.log(parsed);
                setRows(parsed);
            },
        });
    };


    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };


    const uploadToFirestore = async () => {
        if (rows.length === 0) return;

        setUploading(true);
        setMessage("");

        try {
            const res = await fetch("/api/members/bulk-upload", {
                method: "POST",
                body: JSON.stringify(rows),
            });

            if (!res.ok) throw new Error("Upload failed");

            setMessage("Successfully uploaded all members");
            setRows([]);
            fileInputRef.current!.value = ""; // reset file input
        } catch (err) {
            setMessage("Error uploading members: " + (err as Error).toString());
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-2">
            <h1 className="text-2xl font-bold mb-6">Bulk Upload Members</h1>

            <input
                type="file"
                accept=".csv"
                ref={fileInputRef}
                onChange={handleCSV}
                className="hidden"
            />

            <button
                onClick={handleButtonClick}
                className="bg-(--primary) text-(--text) px-4 py-2 rounded hover:bg-blue-700"
            >
                Choose CSV File
            </button>
            <span className="inline-block w-full text-gray-600 bg-slate-200 p-2 text-sm ">
                Format must be:-<br />
                name,gender,family,alive <br />
                Soorya Kumar,Male,Family A, yes <br />
                Sandhya Devi,Female,Family B, no<br />
                Note:the headers are case-sensitive and must be exactly as shown above.
            </span>


            {rows.length > 0 && (
                <div className="border rounded p-4">
                    <h2 className="font-semibold mb-2">Preview ({rows.length} rows)</h2>

                    <table className="w-full text-sm border">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-2">Name</th>
                                <th className="border p-2">Gender</th>
                                <th className="border p-2">Family</th>
                                <th className="border p-2">Alive</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((r, i) => (
                                <tr key={i}>
                                    <td className="border p-2">{r.name}</td>
                                    <td className="border p-2">{r.gender}</td>
                                    <td className="border p-2">{r.family}</td>
                                    <td className="border p-2">{r.alive}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <button
                onClick={uploadToFirestore}
                disabled={uploading || rows.length === 0}
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
            >
                {uploading ? "Uploading..." : "Upload Data"}
            </button>

            {message && <p className="text-green-600 font-semibold">{message}</p>}
        </div>
    );
}

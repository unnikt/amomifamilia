import { NextResponse } from "next/server";
import { adminDB } from "@/lib/server/firebaseAdmin";
import { DB_MEMBERS } from "@/lib/const/database";

export async function POST(req: Request) {
    try {
        const rows = await req.json();
        console.log("Received bulk upload request with rows:", rows);

        let batch = adminDB.batch();
        const col = adminDB.collection(DB_MEMBERS);

        let count = 0;
        rows.forEach((m: any) => {
            const doc = col.doc();
            batch.set(doc, {
                name: m.name,
                gender: m.gender,
                family: [m.family],
                createdAt: m.createdAt ? m.createdAt.toDate().toISOString() : null,
                whoami: m.whoami || "",
                dob: m.dob || "1900-01-01",
                doe: m.doe || "",
                alive: m.alive || "yes",
                phone: m.phone || "000-000-0000",
                maritalstat: m.maritalstat || "Single",
                picUrl: null,
                relations: [],
                families: [m.family],
                creator: m.creator || "unknown",
            });
            count++;
            if (count % 50 === 0) {
                batch.commit();
                batch = adminDB.batch();
            }
        });

        await batch.commit();

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Bulk upload failed:", err);
        return NextResponse.json({ error: "Failed", message: (err as Error).toString() }, { status: 500 });
    }
}

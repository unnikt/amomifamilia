import { adminDB } from "@/lib/server/firebaseAdmin";

export default async function Page() {
    const snap = await adminDB.collection("members").limit(5).get();
    const members = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    return <pre>{JSON.stringify(members, null, 2)}</pre>;
}

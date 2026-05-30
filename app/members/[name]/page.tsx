export const dynamic = "force-dynamic"; // ⬅️ prevents static generation

import { adminDB } from "@/lib/server/firebaseAdmin";
import AddRelation from "@/components/AddRelation";
import RelationsClient from "@/app/ui/Relations";
import { Member } from "@/lib/definitions";

export default async function MemberPage({ params }: { params: Promise<{ name: string }> }) {
    const { name } = await params;
    // export default async function MemberPage({ params }: { params: { name: string } }) {
    //     const name = params?.name ?? "";

    console.log(name)
    const cleanName = name?.replace(/%20/g, " ") || null;

    if (!cleanName) return (<div>No member name provided..!</div>)

    const snaps = await adminDB.collection("members")
        .where("name", "==", cleanName)
        .get();

    if (snaps.empty) {
        return (<div
            className="mx-auto p-4">{cleanName} not found!</div>)
    }
    if (snaps.size > 1)
        return (<div className="mx-auto p-4">Found Multiple individuals</div>)

    const member = snaps.docs[0].data() as Member;
    const id = snaps.docs[0].id;


    return (
        <div className="w-full sm:max-w-2xl mx-auto sm:shadow rounded-lg space-y-2 sm:border border-slate-300 p-4">
            <h1 className="text-2xl font-bold">{member.name}</h1>

            <div className="flex justify-start gap-2 items-center">
                {member.picUrl ? (
                    <img
                        src={member.picUrl}
                        alt={member.name}
                        className="w-40 h-40 object-cover rounded-md border m-0"
                    />
                ) : (
                    <div className="w-40 h-40 bg-gray-200 rounded-md m-0 flex items-center justify-center text-gray-500">
                        No Picture
                    </div>
                )}

                <div className="space-y-1 text-gray-700">
                    <p>{member.whoami}</p>
                    <p>{member.maritalstat}</p>
                    <p>{member.gender}</p>
                    <p>
                        <strong>Born on:</strong> {member.dob}
                    </p>
                </div>
            </div>

            <RelationsClient id={id} member={member as Member} />
        </div>
    );
}

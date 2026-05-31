export const dynamic = "force-dynamic"; // ⬅️ prevents static generation

import { adminDB } from "@/lib/server/firebaseAdmin";
import RelationsClient from "@/app/ui/Relations";
import { Member } from "@/lib/definitions";
import MemberPicture from "@/components/MemberPicture";
import { storage } from "firebase-admin";
import { deleteObject, ref } from "firebase/storage";
import DeleteMemberButton from "@/components/DeleteMemberButton";
import PhoneInput from "@/components/PhoneInput";
import EditPhoneNumber from "@/components/EditPhoneNumber";

export default async function MemberPage({ params }: { params: Promise<{ name: string }> }) {
    const { name } = await params;
    // export default async function MemberPage({ params }: { params: { name: string } }) {
    //     const name = params?.name ?? "";
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
        <div className="w-full sm:max-w-2xl mx-auto  space-y-2 px-6 h-screen">
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold">{member.name}</h1>
                <DeleteMemberButton id={id} />
            </div>
            <div className="flex justify-start gap-2 items-center">
                <MemberPicture id={id} member={member} />
                <div className="space-y-1 text-gray-700 flex-1">
                    <p>{member.whoami}</p>
                    <p>{member.maritalstat}</p>
                    <p>{member.gender}</p>
                    <p>
                        <strong>Born on:</strong> {member.dob}
                    </p>
                </div>
            </div>
            <EditPhoneNumber id={id} member={member} />
            <RelationsClient id={id} member={member as Member} />
        </div>
    );
}

export const dynamic = "force-dynamic"; // ⬅️ prevents static generation

import { adminDB } from "@/lib/server/firebaseAdmin";
import RelationsClient from "@/app/ui/Relations";
import { Member } from "@/lib/definitions";
import MemberPicture from "@/components/MemberPicture";
import DeleteMemberButton from "@/components/DeleteMemberButton";
import EditPhoneNumber from "@/components/EditPhoneNumber";
import { DB_MEMBERS } from "@/lib/const/database";
import EditMember from "@/components/EditMember";

export default async function MemberPage({ params }: { params: Promise<{ name: string }> }) {
    const { name } = await params;
    // export default async function MemberPage({ params }: { params: { name: string } }) {
    //     const name = params?.name ?? "";
    const cleanName = name?.replace(/%20/g, " ") || null;

    if (!cleanName) return (<div>No member name provided..!</div>)

    const snaps = await adminDB.collection(DB_MEMBERS)
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
                <EditMember id={id} member={member} field="name" className="text-2xl font-medium " />
                <DeleteMemberButton id={id} />
            </div>
            <div className="flex justify-start gap-2 items-center">
                <div className="relative flex flex-col items-center">
                    <MemberPicture id={id} member={member} />
                    <i className="absolute bottom-0 text-white ">Click to preview</i>
                </div>
                <div className="space-y-1 text-gray-700 flex-1">
                    <EditMember id={id} member={member} field="whoami" />
                    <EditMember id={id} member={member} field="maritalstat" />
                    <EditMember id={id} member={member} field="gender" />
                    <EditMember id={id} member={member} field="dob" />
                    <EditMember id={id} member={member} field="doe" />
                </div>
            </div>
            <EditPhoneNumber id={id} member={member} />
            <RelationsClient id={id} member={member as Member} />
        </div>
    );
}

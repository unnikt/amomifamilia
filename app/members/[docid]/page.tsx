export const dynamic = "force-dynamic"; // ⬅️ prevents static generation

import { adminDB } from "@/lib/server/firebaseAdmin";
import RelationsClient from "@/app/ui/Relations";
import { Member } from "@/lib/definitions";
import MemberPicture from "@/components/MemberPicture";
import ManageMember from "@/components/ManageMember";
import EditPhoneNumber from "@/components/EditPhoneNumber";
import { DB_MEMBERS } from "@/lib/const/database";

export default async function MemberPage({ params }: { params: Promise<{ docid: string }> }) {
    const { docid } = await params;
    // export default async function MemberPage({ params }: { params: { name: string } }) {
    //     const name = params?.name ?? "";

    console.log(docid);
    const doc = await adminDB.collection(DB_MEMBERS).doc(docid).get();

    const member = doc.data() as Member;
    const id = doc.id;

    return (
        <div className="w-full sm:max-w-2xl mx-auto  space-y-2 px-6 h-screen">
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold">{member.name}</h1>
                <ManageMember id={id} member={member} />
            </div>
            <div className="flex justify-start gap-2 items-center">
                <div className="relative flex flex-col items-center">
                    <MemberPicture id={id} member={member} />
                    <i className="absolute bottom-0 text-white ">Click to preview</i>
                </div>
                <div className="space-y-1 text-gray-700 flex-1">
                    <p>{member.whoami}</p>
                    <p>{member.maritalstat}</p>
                    <p>{member.gender}</p>
                    <p>{member.dob}</p>
                    {member.alive && <p>{member.doe}</p>}
                </div>
            </div>
            <EditPhoneNumber id={id} member={member} />
            <RelationsClient id={id} member={member as Member} />
        </div>
    );
}

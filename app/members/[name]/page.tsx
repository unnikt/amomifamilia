import { adminDB } from "@/lib/server/firebaseAdmin";
import AddRelation from "@/components/AddRelation";
import RelationsClient from "@/app/ui/Relations";
import { Member } from "@/lib/definitions";

export default async function MemberPage({ params }: { params: Promise<{ name: string }> }) {
    const { name } = await params;

    const snaps = await adminDB.collection("members")
        .where("name", "==", name.replace(/%20/g, " "))
        .get();

    if (snaps.empty) {
        return (<div>${name} not found!</div>)
    }
    if (snaps.size > 1)
        return (<div>Found Multiple individuals</div>)

    const member = snaps.docs[0].data();
    const id = snaps.docs[0].id;

    // async function loadMember() {
    //     const q = query(
    //         collection(db, "members"),
    //         where("name", "==", name)
    //     );
    //     const snap = await getDocs(q);


    //     setMember(snap.docs[0].data() as Member);

    //     setLoading(false);
    // }

    // useEffect(() => {
    //     loadMember();
    // }, [name]);

    // if (loading) {
    //     return <p className="text-center mt-10 text-gray-500">Loading member…</p>;
    // }

    // if (!member) {
    //     return <p className="text-center mt-10 text-red-500">Member not found.</p>;
    // }

    return (
        <div className="w-full sm:max-w-2xl mx-auto sm:shadow rounded-lg space-y-2 sm:border border-slate-300 p-4">
            {/* Member Info */}
            <h1 className="text-2xl font-bold">{member.name}</h1>
            <div className="flex justify-start gap-2 items-center">
                {/* Profile Picture */}
                {member.pic ? (
                    <img
                        src={member.pic}
                        alt={member.name}
                        className="w-40 h-40 object-cover rounded-md mx-auto border m-0"
                    />
                ) : (
                    <div className="w-40 h-40 bg-gray-200 rounded-md m-0 flex items-center justify-center text-gray-500">
                        No Picture
                    </div>
                )}

                <div className="space-y-1 text-gray-700">
                    <p> {member.whoami}</p>
                    <p>{member.maritalstat}</p>
                    <p>{member.gender}</p>
                    <p><strong>Born on:</strong> {member.dob}</p>
                </div>

            </div>
            <RelationsClient
                member={member as Member}
            />
            <AddRelation memberId={id} name={member.name} />
        </div>
    );
}

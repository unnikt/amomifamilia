import AddSubFamily from "@/components/AddSubFamily";
import { adminAuth, adminDB } from "@/lib/server/firebaseAdmin";
import { auth } from "firebase-admin";
import Link from "next/link";

export default async function FamilyAddPage({ params }: { params: Promise<{ id: string }> }) {

    const { id } = await params; // Access the family ID from the URL parameters

    const snap = await adminDB.collection("family").doc(id).get();

    if (!snap.exists) {
        return (<div className="max-w-lg mx-auto px-6">
            <h1 className="text-2xl font-semibold mb-4">Family Not Found</h1>
            <p className="text-gray-600 mb-4">
                The family with ID "{id}" does not exist. Please check the URL and try again.
            </p>
        </div>);
    }

    const familyData = snap.data();
    const admIds = familyData?.admins || [];

    const admins: { uid: string; email: string; displayName: string }[] = [];
    await Promise.all(
        admIds.map(async (adminId: string) => {
            try {
                const user = await adminAuth.getUser(adminId);
                admins.push({ uid: user.uid, email: user.email || "", displayName: user.displayName || "" });
            } catch (err) {
                console.error("Failed to fetch admin:", adminId, err);
                return null;
            }
        })
    );

    // Remove nulls
    const filteredAdmins = admins.filter(Boolean);

    return (
        <div className="max-w-lg mx-auto px-6">
            <h1 className="text-2xl font-semibold my-4">{familyData?.name || "Unknown"}</h1>
            <p className="text-xs text-gray-500 mt-2">
                Created: {familyData?.createdAt?.toDate().toLocaleDateString()}
            </p>

            <p className="text-lg font-medium my-2">Admins</p>
            <ol className="list-decimal pl-5 mb-4">
                {filteredAdmins?.map((admin) => (
                    <li key={admin.uid} className="text-gray-700 list-item">
                        {admin.displayName}
                    </li>
                ))}
            </ol>

            <div className="flex  justify-between items-end">
                <p className="text-lg font-medium my-2">Sub families            </p>
                <AddSubFamily fid={id} />
            </div>

            <ol className="list-decimal pl-5 mb-4">
                {familyData?.subfamilies?.map((f: { id: string, name: string }) => (
                    <li key={f.id} className="py-1  list-item">
                        <Link href={`/family/${f.id}`}
                            className="text-(--primary)">
                            {f.name}
                        </Link>
                    </li>
                ))}
            </ol>
            <p className="text-lg font-medium my-2">Members</p>

        </div>
    );
}
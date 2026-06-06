// --- Literal unions (use type) ---
export type Gender = "Male" | "Female";
export type MaritalStatus = "Single" | "Married" | "Divorced" | "Widowed";
export type RelationType =
    | "Father"
    | "Mother"
    | "Brother"
    | "Sister"
    | "Son"
    | "Daughter"
    | "Wife"
    | "Husband";
export type ReverseRelationMap = {
    Father: "Son" | "Daughter";
    Mother: "Son" | "Daughter";
    Brother: "Brother" | "Sister";
    Sister: "Brother" | "Sister";
    Son: "Father" | "Mother";
    Daughter: "Father" | "Mother";
    Husband: "Wife";
    Wife: "Husband";
};


// --- Relation model (use interface) ---
export interface Relation {
    memberId: string;
    type: RelationType; // you can later convert this to a union type
}

// --- Member model (use interface) ---
export interface Member {
    name: string;
    gender: Gender;
    dob: string;
    doe: string;
    alive: "Yes" | "No";
    phone: string;
    whoami: string;
    maritalstat: MaritalStatus;
    picUrl: string | null;   // IMPORTANT: Firestore cannot store File objects
    relations?: Relation[];
    families: string[];
    createdAt: string;
}

// --- Admin model (use interface) ---
export interface Admin {
    uid: string;
    groups: string[];
}

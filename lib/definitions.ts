export type Member = {
    name: string;
    gender: "Male" | "Female" | "Other";
    dob: string;
    phone: string;
    whoami: string;
    maritalstat: "Single" | "Married" | "Divorced" | "Widowed";
    picUrl: File | null;
    relations?: Relation[];
};

export interface Relation {
    memberId: string;
    type: string;
}
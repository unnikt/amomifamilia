export type Member = {
    name: string;
    gender: "Male" | "Female" | "Other";
    dob: string;
    whoami: string;
    maritalstat: "Single" | "Married" | "Divorced" | "Widowed";
    pic: File | null;
    relations?: Relation[];
};

export interface Relation {
    memberId: string;
    type: string;
}
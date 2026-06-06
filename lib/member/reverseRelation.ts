import { Gender, RelationType } from "@/lib/definitions";

export const reverseRelation: Record<RelationType, (gender: Gender) => RelationType> = {
    Father: (gender) => (gender === "Male" ? "Son" : "Daughter"),
    Mother: (gender) => (gender === "Male" ? "Son" : "Daughter"),

    Brother: (gender) => (gender === "Male" ? "Brother" : "Sister"),
    Sister: (gender) => (gender === "Male" ? "Brother" : "Sister"),

    Son: (gender) => (gender === "Male" ? "Father" : "Mother"),
    Daughter: (gender) => (gender === "Male" ? "Father" : "Mother"),

    Husband: () => "Wife",
    Wife: () => "Husband",
};
export const relationGender: Record<RelationType, Gender> = {
    Father: "Male",
    Mother: "Female",

    Brother: "Male",
    Sister: "Female",

    Son: "Male",
    Daughter: "Female",

    Husband: "Male",
    Wife: "Female",
};

export function getReverseRelation(
    relation: RelationType,
    gender: Gender
): RelationType {
    return reverseRelation[relation](gender);
}

export default function getGender(relation: RelationType): Gender {
    return relationGender[relation];
}
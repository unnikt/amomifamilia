export default function getReverseRelationOld(relation: string, otherGender: string): string {
    switch (relation) {
        case "Father":
        case "Mother":
            return otherGender === "Female" ? "Daughter" : "Son";

        case "Son":
        case "Daughter":
            return otherGender === "Female" ? "Mother" : "Father";

        case "Brother": return "Brother";
        case "Sister": return "Sister";
        case "Husband": return "Wife";
        case "Wife": return "Husband";
        default: return "";
    }
}

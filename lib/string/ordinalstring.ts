export function ordinalString(str: string) {
    const n = parseInt(str, 10);
    const addOrdinal = (num: number) => {
        const suffixes = ["th", "st", "nd", "rd"];
        const v = num % 100;
        return num + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
    }
    return isNaN(n) ? str : addOrdinal(n);
}

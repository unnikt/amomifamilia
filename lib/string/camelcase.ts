export function toCamelCase(text: string): string {
    if (!text) return "";
    return text
        .trim()
        .split(/\s+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}
export function slugify(name: string) {
    if (!name) return null;
    return name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")     // strip accents
        .replace(/%20/g, " ")                // handle encoded spaces
        .replace(/[^a-z0-9\s-]/g, "")        // remove punctuation
        .trim()
        .replace(/\s+/g, "-")                // spaces → hyphens
        .replace(/-+/g, "-");                // collapse hyphens
}
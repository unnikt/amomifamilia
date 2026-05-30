import { toCamelCase } from "./camelcase";

export function deSlug(str: string) {
    return toCamelCase(str.replace(/-/g, " ").replace(/%20/g, " "))
}
import { getText } from "./getText.mjs";
export async function getJson(url) {
    try {
        const raw = await getText(url).catch(console.error);
        const parsed = raw ? JSON.parse(raw) : null;
        return parsed;
    }
    catch (ex) {
        console.error(ex);
    }
    return null;
}
//# sourceMappingURL=getJson.mjs.map
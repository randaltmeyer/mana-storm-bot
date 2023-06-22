import { getText } from "./getText.mjs";

export async function getJson<T>(url: string): Promise<T | null> {
	try {
		const raw = await getText(url).catch(console.error);
		const parsed = raw ? JSON.parse(raw) : null;
		// console.log({ url, raw, parsed });
		return parsed;
	}catch(ex) {
		console.error(ex);
	}
	return null;
}
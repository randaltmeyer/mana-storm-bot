import followRedirects from "follow-redirects";

export function getText<T = any>(url: string, postData?: T): Promise<string> {
	if (typeof(url) !== "string") {
		return Promise.reject("Invalid Url");
	}
	if (!url.match(/^https?:\/\//i)) {
		url = "https://" + url;
	}
	const protocol = url.match(/^http:\/\//i) ? followRedirects.http : followRedirects.https;
	const method = postData ? "request" : "get";
	const payload = postData ? JSON.stringify(postData) : null;
	return new Promise((resolve, reject) => {
		try {
			const options = payload ? {
				headers: {
					'Content-Type': 'application/json',
					'Content-Length': payload.length,
				},
				method: "POST"
			} : { };
			const req = protocol[method](url, options, response => {
				try {
					const chunks: Buffer[] = [];
					response.on("data", (chunk: Buffer) =>
						chunks.push(chunk)
					);
					response.once("close", reject);
					response.once("end", () =>
						resolve(Buffer.concat(chunks).toString("utf8"))
					);
					response.once("error", reject);
				}catch(ex) {
					reject(ex);
				}
			});
			req.once("close", reject);
			req.once("error", reject);
			req.once("timeout", reject);
			if (method === "request") {
				req.write(payload);
				req.end();
			}
		}catch(ex) {
			reject(ex);
		}
	});
}

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

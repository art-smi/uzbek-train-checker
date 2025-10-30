let csrfToken: string | null = null;

export function setCsrfToken(token: string): void {
	// store only the raw token value (e.g. cc88f954-75bf-...)
	csrfToken = token;
}

export function getCsrfToken(): string | null {
	return csrfToken;
}

export async function initCsrfToken(): Promise<void> {
	// fetch the csrf endpoint that returns Set-Cookie header
	const res = await fetch("https://eticket.railway.uz/api/v1/csrf-token", {
		method: "GET",
		headers: { accept: "application/json" },
	});

	if (!res.ok) {
		throw new Error(`Failed to obtain CSRF token: ${res.status} ${res.statusText}`);
	}

	// Try typical header access first (works in some environments)
	let setCookie = res.headers.get("set-cookie") || res.headers.get("Set-Cookie") || null;

	if (!setCookie) {
		// Fallback: some Node fetch implementations expose raw headers
		const headersAny = res.headers as any;
		const raw = typeof headersAny.raw === "function" ? headersAny.raw() : headersAny.raw;
		if (raw && typeof raw === "object") {
			// raw may be { 'set-cookie': string[] } or other shapes; collect all string values
			const allCookieStrings: string[] = Object.keys(raw).reduce<string[]>((acc, key) => {
				const val = raw[key];
				if (Array.isArray(val)) {
					return acc.concat(val.filter((v) => typeof v === "string"));
				}
				if (typeof val === "string") {
					acc.push(val);
				}
				return acc;
			}, []);
			// find the first cookie string that contains XSRF-TOKEN
			const found = allCookieStrings.find((c) => c.includes("XSRF-TOKEN="));
			if (found) setCookie = found;
		}
	}

	if (!setCookie) {
		throw new Error("No Set-Cookie header returned from CSRF endpoint (couldn't find XSRF-TOKEN). Ensure the server exposes Set-Cookie and CORS exposes it if calling from the browser.");
	}

	const match = setCookie.match(/XSRF-TOKEN=([^;]+)/);
	if (!match || !match[1]) {
		throw new Error("XSRF-TOKEN not found or empty in Set-Cookie header");
	}

	const rawToken = match[1].trim();
	if (!rawToken) {
		throw new Error("Parsed XSRF-TOKEN is empty after trimming");
	}

	setCsrfToken(rawToken);
}

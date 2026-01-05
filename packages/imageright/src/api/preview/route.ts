import { getBaseUrl } from '../constants';

// NOTE: This endpoint must return the raw Response now (for bytes). We intentionally do not use the JSON fetcher here.
export const getPreview = async (params: { documentId: number, pageIds: number }, baseUrl?: string) => {
	const apiUrl = getBaseUrl(baseUrl);
	const url =
		`${apiUrl}/combined-pdf?` +
		new URLSearchParams({
			documentId: params.documentId.toString(),
			pageIds: params.pageIds.toString(),
		}).toString();
	
	const devToken = import.meta.env.VITE_DEV_AUTH_TOKEN;
	const response = await fetch(url, {
		credentials: 'include', // Include cookies for authentication
		headers: devToken ? { 'Authorization': `Bearer ${devToken}` } : {},
	});
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	return response;
}

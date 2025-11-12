// NOTE: This endpoint must return the raw Response now (for bytes). We intentionally do not use the JSON fetcher here.
const IMAGERIGHT_API_URL = (import.meta as any).env.VITE_IMAGERIGHT_API_URL;

export const getPreview = async (params: { documentId: number, pageIds: number }) => {
	const url =
		`${IMAGERIGHT_API_URL}/combined-pdf?` +
		new URLSearchParams({
			documentId: params.documentId.toString(),
			pageIds: params.pageIds.toString(),
		}).toString();
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	return response;
}

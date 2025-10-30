export type MarketingSubmissionsEmailAttachment = {
	"@odata.type": "#microsoft.graph.fileAttachment";
	"@odata.mediaContentType": string;
	id: string;
	lastModifiedDateTime: string;
	name: string;
	contentType: string;
	size: number;
	isInline: boolean;
	contentId: string | null;
	contentLocation: string | null;
	contentBytes: string;
};



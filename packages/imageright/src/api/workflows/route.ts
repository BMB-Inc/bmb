import { fetcher } from "@api/fetcher";
import { GetWorkflowsDto } from "@bmb-inc/types";

/**
 * Get all workflows
 */
export const getWorkflows = async (params?: GetWorkflowsDto, baseUrl?: string) => {
	const urlParams = new URLSearchParams();
	if (params?.includeBuddies !== undefined) {
		urlParams.append('includeBuddies', params.includeBuddies.toString());
	}
	const queryString = urlParams.toString();
	const url = queryString ? `/workflows?${queryString}` : '/workflows';
	return fetcher(url, baseUrl);
};
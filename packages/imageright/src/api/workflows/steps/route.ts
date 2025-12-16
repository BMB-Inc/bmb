import { fetcher } from "@api/fetcher";
import { GetWorkflowStepsDto } from "@bmb-inc/types";

/**
 * Get workflow steps for a specific workflow
 */
export const getWorkflowSteps = async (workflowId: number, params?: GetWorkflowStepsDto, baseUrl?: string) => {
	const urlParams = new URLSearchParams();
	if (params?.includeBuddies !== undefined) {
		urlParams.append('includeBuddies', params.includeBuddies.toString());
	}
	if (params?.flag) {
		urlParams.append('flag', params.flag);
	}
	const queryString = urlParams.toString();
	const url = queryString 
		? `/workflows/${workflowId}/steps?${queryString}` 
		: `/workflows/${workflowId}/steps`;
	return fetcher(url, baseUrl);
};
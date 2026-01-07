import { fetcher } from '@api/fetcher';
import { FindTasksQueryDto, GetFileTasksDto, GetTaskHistoryDto } from '@bmb-inc/types';

/**
 * Get task history with filtering and pagination
 */
export const getTasks = async (params?: GetTaskHistoryDto, baseUrl?: string) => {
	const urlParams = new URLSearchParams();
	if (params) {
		for (const [key, value] of Object.entries(params)) {
			if (value === undefined || value === null) continue;
			if (Array.isArray(value)) {
				urlParams.append(key, value.join(','));
			} else {
				urlParams.append(key, value.toString());
			}
		}
	}
	const queryString = urlParams.toString();
	const url = queryString ? `/tasks?${queryString}` : '/tasks';
	return fetcher(url, baseUrl);
};

/**
 * Find tasks with advanced filtering (POST request with body)
 */
export const findTasks = async (params?: FindTasksQueryDto, baseUrl?: string) => {
	const urlParams = new URLSearchParams();
	if (params?.skip !== undefined) {
		urlParams.append('skip', params.skip.toString());
	}
	if (params?.top !== undefined) {
		urlParams.append('top', params.top.toString());
	}
	const queryString = urlParams.toString();
	const url = queryString ? `/tasks/find?${queryString}` : '/tasks/find';
	return fetcher(url, baseUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(params),
	});
};

/**
 * Get tasks for a specific file
 */
export const getFileTasks = async (params?: GetFileTasksDto, baseUrl?: string) => {
	const urlParams = new URLSearchParams();
	if (params?.fileId !== undefined) {
		urlParams.append('fileId', params.fileId.toString());
	}
	const queryString = urlParams.toString();
	const url = queryString ? `/tasks/file?${queryString}` : '/tasks/file';
	return fetcher(url, baseUrl);
};

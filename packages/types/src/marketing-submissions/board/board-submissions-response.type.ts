import type { MarketingSubmissionSchema } from "../submissions";

export interface BoardCoordinatorStats {
	coordinator: MarketingSubmissionSchema["Coordinator"];
	submissionCount: number;
}

export interface BoardSubmissionsStats {
	submissionsPerCoordinator: BoardCoordinatorStats[];
}

export interface BoardSubmissionsResponse {
	submissions: Partial<MarketingSubmissionSchema>[];
	stats: BoardSubmissionsStats;
	hasIncompleteEmailHistory?: boolean;
}

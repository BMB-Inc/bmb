import type { BoardSubmissionsStats } from "./board-submissions-response.type";

export interface BoardDashboardStats {
	totalSubmissions: number;
	completedSubmissions: number;
	inProgressSubmissions: number;
	submissionsPerCoordinator: BoardSubmissionsStats["submissionsPerCoordinator"];
}


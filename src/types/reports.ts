export interface TodoHistoryItem {
    id: string;
    todoId: string;
    userId: string;
    text: string;
    completed: boolean;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    action: 'CREATED' | 'COMPLETED' | 'UPDATED' | 'DELETED';
    actionAt: string;  // ISO date string
}

export interface EnrichedTodoHistoryItem {
    id: string;
    todoId: string;
    userId: string;
    username: string;
    text: string;
    completed: boolean;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    action: 'CREATED' | 'COMPLETED' | 'UPDATED' | 'DELETED';
    actionAt: string;  // ISO date string
    actionDescription: string;
}

export interface CompletedTasksWeekReport {
    completedThisWeek: number;
}

export interface UserCompletedRanking {
    username: string;
    completedTasks: number;
}

export interface MostActiveDayReport {
    mostActiveDay: string | null; // e.g., 'MONDAY', 'TUESDAY', or null if no data
}

// Example: { '2023-01': 10, '2023-02': 15 }
export type CreatedTasksByMonth = Record<string, number>;

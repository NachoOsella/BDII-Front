import api from './api';
import type { TodoHistoryItem, EnrichedTodoHistoryItem, CompletedTasksWeekReport, UserCompletedRanking, MostActiveDayReport, CreatedTasksByMonth } from '../types/reports';

export const getTodoHistory = async (userId: string): Promise<TodoHistoryItem[]> => {
    const response = await api.get(`/todos/history/${userId}`);
    return response.data;
};

export const getEnrichedTodoHistory = async (userId: string): Promise<EnrichedTodoHistoryItem[]> => {
    const response = await api.get(`/todos/history-enriched/${userId}`);
    return response.data;
};

export const getCompletedTasksPerWeek = async (userId: string): Promise<CompletedTasksWeekReport> => {
    const response = await api.get(`/todos/report/completed-per-week?userId=${userId}`);
    return response.data;
};

export const getCompletedTasksRanking = async (): Promise<UserCompletedRanking[]> => {
    const response = await api.get('/todos/report/completed-ranking');
    return response.data;
};

export const getMostActiveDayOfWeek = async (userId: string): Promise<MostActiveDayReport> => {
    const response = await api.get(`/todos/report/most-active-day?userId=${userId}`);
    return response.data;
};

export const getCreatedTasksByMonth = async (userId: string): Promise<CreatedTasksByMonth> => {
    const response = await api.get(`/todos/report/created-by-month?userId=${userId}`);
    return response.data;
};

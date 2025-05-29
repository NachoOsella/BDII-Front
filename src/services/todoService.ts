import apiClient from './api';
import type { Todo, TodoCreateDto, TodoUpdateDto } from '../types/todo';

export const getTodos = async (userId: string): Promise<Todo[]> => {
    const response = await apiClient.get<Todo[]>(`/todos/user/${userId}`);
    return response.data;
};

export const createTodo = async (todoData: TodoCreateDto & { userId: string }): Promise<Todo> => {
    const response = await apiClient.post<Todo>('/todos', todoData);
    return response.data;
};

export const getTodoById = async (id: string): Promise<Todo> => {
    const response = await apiClient.get<Todo>(`/todos/${id}`);
    return response.data;
};

// El endpoint PUT /api/todos/{id} es más común para actualizar
export const updateTodo = async (id: string, todoData: TodoUpdateDto): Promise<Todo> => {
    const response = await apiClient.put<Todo>(`/todos/${id}`, todoData); // Asumiendo PUT para actualizar
    return response.data;
};

export const deleteTodo = async (id: string): Promise<void> => {
    await apiClient.delete(`/todos/${id}`);
};
export interface Todo {
    id: string;
    text: string;
    completed: boolean;
    userId: string;
    createdAt: string; // O Date si se parsea
    updatedAt: string; // O Date si se parsea
}

export interface TodoCreateDto {
    text: string;
    userId?: string; // Se agrega userId opcional para facilitar el tipado en el frontend
}

export interface TodoUpdateDto {
    text?: string;
    completed?: boolean;
}
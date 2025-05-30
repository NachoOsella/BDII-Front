import React, { useState, useEffect, useCallback } from 'react';
import TodoForm from '../components/TodoForm';
import TodoList from '../components/TodoList';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../services/todoService';
import { useAuth } from '../hooks/useAuth';
import type { Todo, TodoCreateDto, TodoUpdateDto } from '../types/todo';

const TodosDashboardPage: React.FC = () => {
    const { user } = useAuth();
    const [todos, setTodos] = useState<Todo[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [editingTodo, setEditingTodo] = useState<Todo | null>(null); // Para el modo edición

    const fetchTodos = useCallback(async () => {
        if (!user || !user.id || user.id === '' || user.id === ':1') {
            setError('Usuario no válido. Por favor, vuelve a iniciar sesión.');
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const data = await getTodos(user.id);
            setTodos(data);
        } catch (err) {
            setError('Error al cargar las tareas.');
            console.error('Valor de user:', user);
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchTodos();
    }, [fetchTodos]);

    const handleAddTodo = async (todoData: TodoCreateDto) => {
        if (!user) return;
        try {
            await createTodo({ ...todoData, userId: user.id });
            fetchTodos(); // Recargar lista
        } catch (err) {
            setError('Error al crear la tarea.');
            console.error(err);
        }
    };

    const handleUpdateTodo = async (todoData: TodoUpdateDto) => {
        if (!editingTodo) return;
        try {
            await updateTodo(editingTodo.id, todoData);
            setEditingTodo(null); // Salir del modo edición
            fetchTodos(); // Recargar lista
        } catch (err) {
            setError('Error al actualizar la tarea.');
            console.error(err);
        }
    };

    const handleFormSubmit = async (data: TodoCreateDto | TodoUpdateDto) => {
        if (editingTodo) {
            await handleUpdateTodo(data as TodoUpdateDto);
        } else {
            await handleAddTodo(data as TodoCreateDto);
        }
    };

    const handleToggleComplete = async (id: string, completed: boolean) => {
        try {
            // Call updateTodo service to change the completed status
            await updateTodo(id, { completed });
            fetchTodos(); // Refresh list after updating
        } catch (err) {
            setError('Error al cambiar estado de la tarea.');
            console.error(err);
        }
    };

    const handleEditTodo = (todo: Todo) => {
        setEditingTodo(todo); // Entrar en modo edición
    };

    const handleDelete = async (id: string) => { // Added handleDelete function
        try {
            await deleteTodo(id);
            fetchTodos(); // Recargar todos después de borrar
        } catch (error) {
            console.error("Error al borrar todo:", error);
            // Considerar mostrar un mensaje al usuario
        }
    };

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p className="loading-text">Cargando tareas...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-message">
                <strong>Error:</strong> {error}
            </div>
        );
    }

    return (
        <div className="container fade-in">
            <div className="reports-header">
                <h1>Mis Tareas</h1>
                <p>Organiza y gestiona tus actividades diarias</p>
            </div>

            <TodoForm
                onSubmit={handleFormSubmit}
                initialData={editingTodo}
                isEditing={!!editingTodo}
                buttonText={editingTodo ? 'Actualizar' : 'Añadir Tarea'}
            />

            {editingTodo && (
                <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                    <button onClick={() => setEditingTodo(null)} className="btn btn-secondary">
                        Cancelar Edición
                    </button>
                </div>
            )}

            <TodoList
                todos={todos}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEditTodo}
                onDelete={handleDelete}
            />
        </div>
    );
};

export default TodosDashboardPage;
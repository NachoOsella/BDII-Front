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
            await updateTodo(id, { completed });
            fetchTodos();
        } catch (err) {
            setError('Error al actualizar estado de la tarea.');
            console.error(err);
        }
    };

    const handleDeleteTodo = async (id: string) => {
        try {
            await deleteTodo(id);
            fetchTodos();
        } catch (err) {
            setError('Error al eliminar la tarea.');
            console.error(err);
        }
    };

    const handleEditTodo = (todo: Todo) => {
        setEditingTodo(todo); // Entrar en modo edición
    };

    if (isLoading) return <p>Cargando tareas...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div style={{ maxWidth: '600px', margin: 'auto' }}>
            <h1>Mis Tareas</h1>
            <TodoForm
                onSubmit={handleFormSubmit}
                initialData={editingTodo}
                isEditing={!!editingTodo}
                buttonText={editingTodo ? 'Actualizar Tarea' : 'Añadir Tarea'}
            />
            {editingTodo && <button onClick={() => setEditingTodo(null)} style={{ marginBottom: '10px' }}>Cancelar Edición</button>}
            <TodoList
                todos={todos}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDeleteTodo}
                onEdit={handleEditTodo}
            />
        </div>
    );
};

export default TodosDashboardPage;
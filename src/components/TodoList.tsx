import React from 'react';
import type { Todo } from '../types/todo';
import TodoItem from './TodoItem';

interface TodoListProps {
    todos: Todo[];
    onToggleComplete: (id: string, completed: boolean) => void;
    onEdit: (todo: Todo) => void;
    onDelete: (id: string) => void; // Added onDelete prop
}

const TodoList: React.FC<TodoListProps> = ({ todos, onToggleComplete, onEdit, onDelete }) => {
    const activeTodos = todos.filter(todo => !todo.completed);

    if (!activeTodos.length) {
        return (
            <div className="empty-state">
                <div className="empty-state-icon">
                    <div className="icon-circle-large" />
                </div>
                <h3>No tienes tareas pendientes</h3>
                <p>¡Añade una nueva tarea para comenzar!</p>
            </div>
        );
    }

    return (
        <ul className="todo-list stagger-animation">
            {activeTodos.map(todo => (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggleComplete={onToggleComplete}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </ul>
    );
};


export default TodoList;
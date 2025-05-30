import React from 'react';
import type { Todo } from '../types/todo';

interface TodoItemProps {
    todo: Todo;
    onToggleComplete: (id: string, completed: boolean) => void;
    onDelete: (id: string) => void; // Added onDelete
    onEdit: (todo: Todo) => void; // Para iniciar la edición
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggleComplete, onDelete, onEdit }) => {
    return (
        <li className={`todo-item micro-bounce ${todo.completed ? 'completed' : ''}`}>
            <span
                onClick={() => onToggleComplete(todo.id, !todo.completed)}
                className="todo-text"
            >
                {todo.text}
            </span>
            <div className="todo-actions">
                <button onClick={() => onEdit(todo)} className="btn btn-small btn-secondary">
                    Editar
                </button>
                <button
                    onClick={() => onToggleComplete(todo.id, true)}
                    className="btn btn-small"
                >
                    Completar
                </button>
                <button
                    onClick={() => onDelete(todo.id)}
                    className="btn btn-small delete-btn"
                >
                    Borrar
                </button>
            </div>
        </li>
    );
};

export default TodoItem;
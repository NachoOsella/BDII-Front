import React from 'react';
import type { Todo } from '../types/todo';

interface TodoItemProps {
    todo: Todo;
    onToggleComplete: (id: string, completed: boolean) => void;
    onDelete: (id: string) => void; // Added onDelete
    onEdit: (todo: Todo) => void; // Para iniciar la edición
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggleComplete, onDelete, onEdit }) => { // Added onDelete to destructuring
    return (
        <li style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px',
            border: '1px solid #ccc',
            marginBottom: '5px',
            textDecoration: todo.completed ? 'line-through' : 'none'
        }}>
            <span onClick={() => onToggleComplete(todo.id, !todo.completed)} style={{ cursor: 'pointer' }}>
                {todo.text}
            </span>
            <div>
                <button onClick={() => onEdit(todo)} style={{ marginRight: '5px' }}>Editar</button>
                {/* Changed from Delete to Complete, calls onToggleComplete to mark as completed */}
                <button onClick={() => onToggleComplete(todo.id, true)} style={{ marginRight: '5px' }}>Completar</button>
                <button onClick={() => onDelete(todo.id)}>Borrar</button> {/* Added Delete button */}
            </div>
        </li>
    );
};

export default TodoItem;
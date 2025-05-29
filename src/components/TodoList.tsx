import React from 'react';
import type { Todo } from '../types/todo';
import TodoItem from './TodoItem';

interface TodoListProps {
    todos: Todo[];
    onToggleComplete: (id: string, completed: boolean) => void;
    onDelete: (id: string) => void;
    onEdit: (todo: Todo) => void;
}

const TodoList: React.FC<TodoListProps> = ({ todos, onToggleComplete, onDelete, onEdit }) => {
    if (!todos.length) {
        return <p>No tienes tareas pendientes. ¡Añade una!</p>;
    }

    return (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
            {todos.map(todo => (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggleComplete={onToggleComplete}
                    onDelete={onDelete}
                    onEdit={onEdit}
                />
            ))}
        </ul>
    );
};

export default TodoList;
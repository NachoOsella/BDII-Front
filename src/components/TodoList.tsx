import React from 'react';
import type { Todo } from '../types/todo';
import TodoItem from './TodoItem';

interface TodoListProps {
    todos: Todo[];
    onToggleComplete: (id: string, completed: boolean) => void;
    onEdit: (todo: Todo) => void;
    onDelete: (id: string) => void; // Added onDelete prop
}

const TodoList: React.FC<TodoListProps> = ({ todos, onToggleComplete, onEdit, onDelete }) => { // Added onDelete to destructuring
    const activeTodos = todos.filter(todo => !todo.completed);

    if (!activeTodos.length) {
        return <p>No tienes tareas pendientes. ¡Añade una!</p>;
    }

    return (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
            {activeTodos.map(todo => (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggleComplete={onToggleComplete}
                    onEdit={onEdit}
                    onDelete={onDelete} // Passed onDelete to TodoItem
                />
            ))}
        </ul>
    );
};

export default TodoList;
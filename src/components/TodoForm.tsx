import React, { useState, useEffect } from 'react';
import type { Todo, TodoCreateDto, TodoUpdateDto } from '../types/todo';

interface TodoFormProps {
    onSubmit: (data: TodoCreateDto | TodoUpdateDto) => Promise<void>;
    initialData?: Todo | null; // Para edición
    buttonText?: string;
    isEditing?: boolean;
}

const TodoForm: React.FC<TodoFormProps> = ({ onSubmit, initialData, buttonText = "Añadir Tarea", isEditing = false }) => {
    const [text, setText] = useState('');

    useEffect(() => {
        if (isEditing && initialData) {
            setText(initialData.text);
        } else {
            setText(''); // Limpiar para nueva tarea
        }
    }, [initialData, isEditing]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!text.trim()) return;

        if (isEditing && initialData) {
            onSubmit({ text }); // Solo actualizamos el texto en este ejemplo simple
        } else {
            onSubmit({ text });
        }
        if (!isEditing) setText(''); // Limpiar solo si no estamos editando (o si la edición cierra el form)
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <input
                type="text"
                placeholder="Nueva tarea..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                style={{ flexGrow: 1, padding: '8px' }}
            />
            <button type="submit" style={{ padding: '8px 15px' }}>
                {isEditing ? 'Actualizar Tarea' : buttonText}
            </button>
        </form>
    );
};

export default TodoForm;
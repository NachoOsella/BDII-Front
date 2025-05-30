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
        <div className="card">
            <form onSubmit={handleSubmit} className="form-field">
                <div className="form-input-group">
                    <div className="form-input-flex">
                        <input
                            type="text"
                            placeholder="Nueva tarea..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="form-input"
                        />
                    </div>
                    <button type="submit" className="btn">
                        {isEditing ? 'Actualizar' : buttonText}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TodoForm;
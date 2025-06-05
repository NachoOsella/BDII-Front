package frc.bd.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import frc.bd.model.Todo;
import frc.bd.repository.TodoRepository;

@Service
public class TodoService {
    @Autowired
    private TodoRepository todoRepository;

    @Autowired
    private TodoHistoryService todoHistoryService;

    //devuelve una lista de todas las tareas (Todo) asociadas a ese usuario.
    public List<Todo> getTodosByUserId(String userId) {
        return todoRepository.findByUserId(userId);
    }
    //buscar la tarea por su ID
    public Optional<Todo> getTodoById(String id) {
        return todoRepository.findById(id);
    }

    //guarda una tarea (Todo) en la base de datos
    public Todo save(Todo todo) {
        boolean isNew = (todo.getId() == null);
        boolean wasCompleted = false;

        if (!isNew) {
            // Para tareas existentes, verificar el estado anterior
            Optional<Todo> existing = todoRepository.findById(todo.getId());
            if (existing.isPresent()) {
                wasCompleted = existing.get().isCompleted();
            }
        }

        Todo saved = todoRepository.save(todo);

        if (isNew) {
            todoHistoryService.logHistory(saved, "CREATED");
        } else if (!wasCompleted && saved.isCompleted()) {
            // Solo registrar COMPLETED cuando la tarea se marca como completada por primera
            // vez
            todoHistoryService.logHistory(saved, "COMPLETED");
        } else {
            todoHistoryService.logHistory(saved, "UPDATED");
        }
        return saved;
    }

    // elimina una tarea por su ID.
    public void deleteById(String id) {
        todoRepository.findById(id).ifPresent(todo -> {
            todoHistoryService.logHistory(todo, "DELETED");
            todoRepository.deleteById(id);
        });
    }
}

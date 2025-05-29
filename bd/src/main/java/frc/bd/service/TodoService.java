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

    public List<Todo> getTodosByUserId(String userId) {
        return todoRepository.findByUserId(userId);
    }

    public Optional<Todo> getTodoById(String id) {
        return todoRepository.findById(id);
    }

    public Todo save(Todo todo) {
        boolean isNew = (todo.getId() == null);
        Todo saved = todoRepository.save(todo);
        if (isNew) {
            todoHistoryService.logHistory(saved, "CREATED");
        } else if (todo.isCompleted()) {
            todoHistoryService.logHistory(saved, "COMPLETED");
        } else {
            todoHistoryService.logHistory(saved, "UPDATED");
        }
        return saved;
    }

    public void deleteById(String id) {
        todoRepository.findById(id).ifPresent(todo -> {
            todoHistoryService.logHistory(todo, "DELETED");
            todoRepository.deleteById(id);
        });
    }
}

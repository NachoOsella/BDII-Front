package frc.bd.service;

import java.time.Instant;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import frc.bd.model.Todo;
import frc.bd.model.TodoHistory;
import frc.bd.repository.TodoHistoryRepository;

@Service
public class TodoHistoryService {
    @Autowired
    private TodoHistoryRepository todoHistoryRepository;

    public void logHistory(Todo todo, String action) {
        TodoHistory history = new TodoHistory(
                todo.getId(),
                todo.getUserId(),
                todo.getText(),
                todo.isCompleted(),
                todo.getCreatedAt(),
                todo.getUpdatedAt(),
                action,
                Instant.now()
        );
        todoHistoryRepository.save(history);
    }

    public List<TodoHistory> getHistoryByUser(String userId) {
        return todoHistoryRepository.findByUserIdOrderByActionAtDesc(userId);
    }

    public List<TodoHistory> getHistoryByTodo(String todoId) {
        return todoHistoryRepository.findByTodoIdOrderByActionAtDesc(todoId);
    }
}

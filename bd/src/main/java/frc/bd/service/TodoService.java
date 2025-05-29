package frc.bd.service;

import frc.bd.model.Todo;
import frc.bd.repository.TodoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TodoService {
    @Autowired
    private TodoRepository todoRepository;

    public List<Todo> getTodosByUserId(String userId) {
        return todoRepository.findByUserId(userId);
    }

    public Optional<Todo> getTodoById(String id) {
        return todoRepository.findById(id);
    }

    public Todo save(Todo todo) {
        return todoRepository.save(todo);
    }

    public void deleteById(String id) {
        todoRepository.deleteById(id);
    }
}

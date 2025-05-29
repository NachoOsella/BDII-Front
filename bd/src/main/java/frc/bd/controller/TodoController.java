package frc.bd.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import frc.bd.dto.TodoDTO;
import frc.bd.model.Todo;
import frc.bd.service.TodoService;

@RestController
@RequestMapping("/api/todos")
public class TodoController {
    @Autowired
    private TodoService todoService;

    @GetMapping("/user/{userId}")
    public List<TodoDTO> getTodosByUser(@PathVariable String userId) {
        return todoService.getTodosByUserId(userId)
                .stream()
                .map(todo -> new TodoDTO(todo.getId(), todo.getText(), todo.isCompleted(), todo.getUserId(), todo.getCreatedAt(), todo.getUpdatedAt()))
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public TodoDTO getTodoById(@PathVariable String id) {
        Todo todo = todoService.getTodoById(id).orElseThrow();
        return new TodoDTO(todo.getId(), todo.getText(), todo.isCompleted(), todo.getUserId(), todo.getCreatedAt(), todo.getUpdatedAt());
    }

    @PostMapping
    public TodoDTO createTodo(@RequestBody TodoDTO todoDTO) {
        Todo todo = new Todo(todoDTO.getText(), false, todoDTO.getUserId());
        Todo saved = todoService.save(todo);
        return new TodoDTO(saved.getId(), saved.getText(), saved.isCompleted(), saved.getUserId(), saved.getCreatedAt(), saved.getUpdatedAt());
    }

    @PutMapping("/{id}")
    public TodoDTO updateTodo(@PathVariable String id, @RequestBody TodoDTO todoDTO) {
        Todo todo = todoService.getTodoById(id).orElseThrow();
        todo.setText(todoDTO.getText());
        todo.setCompleted(todoDTO.isCompleted());
        todo.setUpdatedAt(java.time.Instant.now());
        Todo updated = todoService.save(todo);
        return new TodoDTO(updated.getId(), updated.getText(), updated.isCompleted(), updated.getUserId(), updated.getCreatedAt(), updated.getUpdatedAt());
    }

    @DeleteMapping("/{id}")
    public void deleteTodo(@PathVariable String id) {
        todoService.deleteById(id);
    }

    @GetMapping
    public List<TodoDTO> getAllTodos() {
        return todoService.getTodosByUserId(null) // O ajusta según lógica de negocio
                .stream()
                .map(todo -> new TodoDTO(todo.getId(), todo.getText(), todo.isCompleted(), todo.getUserId(), todo.getCreatedAt(), todo.getUpdatedAt()))
                .collect(Collectors.toList());
    }
}

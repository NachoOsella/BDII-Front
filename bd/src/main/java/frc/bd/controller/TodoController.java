package frc.bd.controller;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import frc.bd.dto.TodoDTO;
import frc.bd.dto.TodoHistoryDTO;
import frc.bd.model.Todo;
import frc.bd.service.TodoHistoryService;
import frc.bd.service.TodoService;

@RestController
@RequestMapping("/api/todos")
public class TodoController {
    @Autowired
    private TodoHistoryService todoHistoryService;

    @Autowired
    private TodoService todoService;


    // Devuelve todas las tareas de un usuario específico.
    @GetMapping("/user/{userId}")
    public List<TodoDTO> getTodosByUser(@PathVariable String userId) {
        return todoService.getTodosByUserId(userId)
                .stream()
                .map(todo -> new TodoDTO(todo.getId(), todo.getText(), todo.isCompleted(), todo.getUserId(),
                        todo.getCreatedAt(), todo.getUpdatedAt()))
                .collect(Collectors.toList());
    }


    // Devuelve una tarea por su ID.
    @GetMapping("/{id}")
    public TodoDTO getTodoById(@PathVariable String id) {
        Todo todo = todoService.getTodoById(id).orElseThrow();
        return new TodoDTO(todo.getId(), todo.getText(), todo.isCompleted(), todo.getUserId(), todo.getCreatedAt(),
                todo.getUpdatedAt());
    }


    // Crea una nueva tarea.
    @PostMapping
    public TodoDTO createTodo(@RequestBody TodoDTO todoDTO) {
        Todo todo = new Todo(todoDTO.getText(), false, todoDTO.getUserId());
        Todo saved = todoService.save(todo);
        return new TodoDTO(saved.getId(), saved.getText(), saved.isCompleted(), saved.getUserId(), saved.getCreatedAt(),
                saved.getUpdatedAt());
    }


    // Actualiza los datos de una tarea existente.
    @PutMapping("/{id}")
    public TodoDTO updateTodo(@PathVariable String id, @RequestBody TodoDTO todoDTO) {
        Todo todo = todoService.getTodoById(id).orElseThrow();

        // Solo actualizar los campos que no son null
        if (todoDTO.getText() != null) {
            todo.setText(todoDTO.getText());
        }
        // El campo completed es boolean, así que siempre se actualiza
        todo.setCompleted(todoDTO.isCompleted());
        todo.setUpdatedAt(java.time.Instant.now());

        Todo updated = todoService.save(todo);
        return new TodoDTO(updated.getId(), updated.getText(), updated.isCompleted(), updated.getUserId(),
                updated.getCreatedAt(), updated.getUpdatedAt());
    }


    // Elimina una tarea según su ID.
    @DeleteMapping("/{id}")
    public void deleteTodo(@PathVariable String id) {
        todoService.deleteById(id);
    }


    // Devuelve todas las tareas 
    @GetMapping
    public List<TodoDTO> getAllTodos() {
        return todoService.getTodosByUserId(null) // O ajusta según lógica de negocio
                .stream()
                .map(todo -> new TodoDTO(todo.getId(), todo.getText(), todo.isCompleted(), todo.getUserId(),
                        todo.getCreatedAt(), todo.getUpdatedAt()))
                .collect(Collectors.toList());
    }


    // Devuelve el historial de acciones sobre tareas de un usuario.
    @GetMapping("/history/{userId}")
    public List<TodoHistoryDTO> getTodoHistoryByUser(@PathVariable String userId) {
        return todoHistoryService.getHistoryByUser(userId)
                .stream()
                .map(h -> new TodoHistoryDTO(
                        h.getId(),
                        h.getTodoId(),
                        h.getUserId(),
                        h.getText(),
                        h.isCompleted(),
                        h.getCreatedAt(),
                        h.getUpdatedAt(),
                        h.getAction(),
                        h.getActionAt()))
                .collect(Collectors.toList());
    }



    @GetMapping("/history-enriched/{userId}")
    public List<Map<String, Object>> getEnrichedTodoHistoryByUser(@PathVariable String userId) {
        return todoHistoryService.getEnrichedHistoryByUser(userId);
    }


    // Devuelve la cantidad de tareas completadas por un usuario en la última semana.
    @GetMapping("/report/completed-per-week")
    public Map<String, Object> getCompletedTasksPerWeek(@RequestParam String userId) {
        Instant now = Instant.now();
        Instant weekAgo = now.minus(7, ChronoUnit.DAYS);
        long count = todoHistoryService.countCompletedInPeriod(userId, weekAgo, now);
        Map<String, Object> result = new HashMap<>();
        result.put("userId", userId);
        result.put("completedThisWeek", count);
        return result;
    }

    // Ranking de usuarios con más tareas completadas históricamente
    @GetMapping("/report/completed-ranking")
    public List<Map<String, Object>> getCompletedTasksRanking() {
        return todoHistoryService.getCompletedTasksRanking();
    }

    // Devuelve el día de la semana en que el usuario fue más activo creando tareas.
    @GetMapping("/report/most-active-day")
    public Map<String, Object> getMostActiveDayOfWeek(@RequestParam String userId) {
        String day = todoHistoryService.getMostActiveDayOfWeek(userId);
        Map<String, Object> result = new HashMap<>();
        result.put("userId", userId);
        result.put("mostActiveDay", day);
        return result;
    }

    
    // Devuelve la cantidad de tareas creadas por mes para un usuario.
    @GetMapping("/report/created-by-month")
    public Map<String, Long> getCreatedTasksByMonth(@RequestParam String userId) {
        return todoHistoryService.getCreatedTasksByMonth(userId);
    }
}

package frc.bd.service;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import frc.bd.model.Todo;
import frc.bd.model.TodoHistory;
import frc.bd.repository.TodoHistoryRepository;
import frc.bd.service.UserService;

@Service
public class TodoHistoryService {
    @Autowired
    private TodoHistoryRepository todoHistoryRepository;

    @Autowired
    private UserService userService;

    public void logHistory(Todo todo, String action) {
        // Asegurar que el texto no sea null
        String todoText = todo.getText();
        if (todoText == null || todoText.trim().isEmpty()) {
            todoText = "Tarea sin nombre";
        }

        TodoHistory history = new TodoHistory(
                todo.getId(),
                todo.getUserId(),
                todoText,
                todo.isCompleted(),
                todo.getCreatedAt(),
                todo.getUpdatedAt(),
                action,
                Instant.now());

        todoHistoryRepository.save(history);
    }

    public List<TodoHistory> getHistoryByUser(String userId) {
        return todoHistoryRepository.findByUserIdOrderByActionAtDesc(userId);
    }

    public List<TodoHistory> getHistoryByTodo(String todoId) {
        return todoHistoryRepository.findByTodoIdOrderByActionAtDesc(todoId);
    }

    // Cuenta la cantidad de tareas completadas por un usuario en un periodo
    public long countCompletedInPeriod(String userId, Instant from, Instant to) {
        // Aseguramos que los parámetros y tipos sean correctos
        return todoHistoryRepository.countByUserIdAndActionAndActionAtBetween(
                userId, "COMPLETED", from, to);
    }

    // Ranking de usuarios con más tareas completadas históricamente
    public List<Map<String, Object>> getCompletedTasksRanking() {
        List<frc.bd.repository.TodoHistoryRepository.UserCompletedCount> results = todoHistoryRepository
                .countCompletedTasksGroupByUser();
        List<Map<String, Object>> ranking = new java.util.ArrayList<>();
        for (frc.bd.repository.TodoHistoryRepository.UserCompletedCount row : results) {
            Map<String, Object> entry = new java.util.HashMap<>();
            String userId = row.get_id();
            String username = userService.findById(userId)
                    .map(user -> user.getUsername())
                    .orElse("Usuario desconocido");
            entry.put("username", username);
            entry.put("completedTasks", row.getCompletedTasks());
            ranking.add(entry);
        }
        // Ordenar de mayor a menor
        ranking.sort((a, b) -> Integer.compare((int) b.get("completedTasks"), (int) a.get("completedTasks")));
        return ranking;
    }

    // Devuelve el día de la semana en el que el usuario creó más tareas
    public String getMostActiveDayOfWeek(String userId) {
        List<TodoHistory> history = todoHistoryRepository.findByUserIdOrderByActionAtDesc(userId);
        Map<String, Integer> dayCount = new HashMap<>();
        for (TodoHistory h : history) {
            if ("CREATED".equals(h.getAction())) {
                String day = h.getCreatedAt().atZone(java.time.ZoneId.systemDefault()).getDayOfWeek().toString();
                dayCount.put(day, dayCount.getOrDefault(day, 0) + 1);
            }
        }
        return dayCount.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(null);
    }

    // Devuelve la cantidad de tareas creadas por mes para un usuario
    public Map<String, Long> getCreatedTasksByMonth(String userId) {
        List<TodoHistory> history = todoHistoryRepository.findByUserIdOrderByActionAtDesc(userId);
        Map<String, Long> monthCount = new HashMap<>();
        for (TodoHistory h : history) {
            if ("CREATED".equals(h.getAction())) {
                java.time.ZonedDateTime zdt = h.getCreatedAt().atZone(java.time.ZoneId.systemDefault());
                String month = zdt.getYear() + "-" + String.format("%02d", zdt.getMonthValue());
                monthCount.put(month, monthCount.getOrDefault(month, 0L) + 1);
            }
        }
        return monthCount;
    }

    // Devuelve el historial enriquecido con el nombre del usuario
    public List<Map<String, Object>> getEnrichedHistoryByUser(String userId) {
        List<TodoHistory> history = todoHistoryRepository.findByUserIdOrderByActionAtDesc(userId);
        List<Map<String, Object>> enrichedHistory = new java.util.ArrayList<>();

        for (TodoHistory h : history) {
            Map<String, Object> entry = new java.util.HashMap<>();
            entry.put("id", h.getId());
            entry.put("todoId", h.getTodoId());
            entry.put("userId", h.getUserId());

            // Obtener el nombre del usuario
            String username = userService.findById(h.getUserId())
                    .map(user -> user.getUsername())
                    .orElse("Usuario desconocido");
            entry.put("username", username);

            entry.put("text", h.getText());
            entry.put("completed", h.isCompleted());
            entry.put("createdAt", h.getCreatedAt());
            entry.put("updatedAt", h.getUpdatedAt());
            entry.put("action", h.getAction());
            entry.put("actionAt", h.getActionAt());

            // Agregar una descripción más amigable de la acción
            String actionDescription = getActionDescription(h.getAction(), h.getText());
            entry.put("actionDescription", actionDescription);

            enrichedHistory.add(entry);
        }

        return enrichedHistory;
    }

    // Método auxiliar para generar descripciones más amigables de las acciones
    private String getActionDescription(String action, String todoText) {
        String safeText = (todoText != null && !todoText.trim().isEmpty()) ? todoText : "Tarea sin nombre";
        switch (action) {
            case "CREATED":
                return "Creó la tarea: \"" + safeText + "\"";
            case "COMPLETED":
                return "Completó la tarea: \"" + safeText + "\"";
            case "UPDATED":
                return "Actualizó la tarea: \"" + safeText + "\"";
            case "DELETED":
                return "Eliminó la tarea: \"" + safeText + "\"";
            default:
                return "Acción desconocida en la tarea: \"" + safeText + "\"";
        }
    }
}

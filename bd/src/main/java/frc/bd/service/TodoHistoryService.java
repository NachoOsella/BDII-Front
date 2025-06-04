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

// Servicio que gestiona el historial de acciones sobre las tareas (Todo).
// Permite registrar acciones (crear, actualizar, completar, eliminar),
// obtener historiales por usuario o tarea, generar reportes de actividad,
// y enriquecer los datos del historial con información adicional del usuario.
@Service
public class TodoHistoryService {
    @Autowired
    private TodoHistoryRepository todoHistoryRepository;

    @Autowired
    private UserService userService;

    // Registra una acción realizada sobre una tarea en el historial.
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

    // Obtiene el historial de acciones de un usuario, ordenado por fecha descendente.
    public List<TodoHistory> getHistoryByUser(String userId) {
        return todoHistoryRepository.findByUserIdOrderByActionAtDesc(userId);
    }

    // Obtiene el historial de acciones de una tarea específica, ordenado por fecha descendente.
    public List<TodoHistory> getHistoryByTodo(String todoId) {
        return todoHistoryRepository.findByTodoIdOrderByActionAtDesc(todoId);
    }

    // Cuenta la cantidad de tareas completadas por un usuario en un periodo dado.
    public long countCompletedInPeriod(String userId, Instant from, Instant to) {
        // Aseguramos que los parámetros y tipos sean correctos
        return todoHistoryRepository.countByUserIdAndActionAndActionAtBetween(
                userId, "COMPLETED", from, to);
    }

    // Devuelve un ranking de usuarios con más tareas completadas históricamente.
    public List<Map<String, Object>> getCompletedTasksRanking() {
        // Obtiene la lista de usuarios y la cantidad de tareas completadas usando una consulta agregada
        List<frc.bd.repository.TodoHistoryRepository.UserCompletedCount> results = todoHistoryRepository
                .countCompletedTasksGroupByUser();
        // Lista para almacenar el ranking final
        List<Map<String, Object>> ranking = new java.util.ArrayList<>();
        // Itera sobre cada resultado de la consulta agregada
        for (frc.bd.repository.TodoHistoryRepository.UserCompletedCount row : results) {
            Map<String, Object> entry = new java.util.HashMap<>();
            String userId = row.get_id(); // Obtiene el id del usuario
            // Busca el nombre de usuario usando el servicio de usuario, si no lo encuentra pone 'Usuario desconocido'
            String username = userService.findById(userId)
                    .map(user -> user.getUsername())
                    .orElse("Usuario desconocido");
            entry.put("username", username); // Agrega el nombre de usuario al mapa
            entry.put("completedTasks", row.getCompletedTasks()); // Agrega la cantidad de tareas completadas
            ranking.add(entry); // Agrega el mapa a la lista de ranking
        }
        // Ordena la lista de ranking de mayor a menor según la cantidad de tareas completadas
        ranking.sort((a, b) -> Integer.compare((int) b.get("completedTasks"), (int) a.get("completedTasks")));
        return ranking;
    }

    // Devuelve el día de la semana en el que el usuario creó más tareas.
    public String getMostActiveDayOfWeek(String userId) {
        // Obtiene el historial de acciones del usuario ordenado por fecha descendente
        List<TodoHistory> history = todoHistoryRepository.findByUserIdOrderByActionAtDesc(userId);
        // Mapa para contar la cantidad de tareas creadas por cada día de la semana
        Map<String, Integer> dayCount = new HashMap<>();
        // Recorre el historial
        for (TodoHistory h : history) {
            // Solo considera las acciones de creación de tareas
            if ("CREATED".equals(h.getAction())) {
                // Obtiene el día de la semana de la fecha de creación
                String day = h.getCreatedAt().atZone(java.time.ZoneId.systemDefault()).getDayOfWeek().toString();
                // Suma 1 al contador de ese día
                dayCount.put(day, dayCount.getOrDefault(day, 0) + 1);
            }
        }
        // Busca el día con mayor cantidad de tareas creadas
        return dayCount.entrySet().stream()
                .max(Map.Entry.comparingByValue()) // Busca el entry con el valor máximo
                .map(Map.Entry::getKey) // Devuelve el nombre del día
                .orElse(null); // Si no hay datos, devuelve null
    }

    // Devuelve la cantidad de tareas creadas por mes para un usuario.
    public Map<String, Long> getCreatedTasksByMonth(String userId) {
        // Obtiene el historial de acciones del usuario ordenado por fecha descendente
        List<TodoHistory> history = todoHistoryRepository.findByUserIdOrderByActionAtDesc(userId);
        // Mapa para contar la cantidad de tareas creadas por mes (clave: "YYYY-MM", valor: cantidad)
        Map<String, Long> monthCount = new HashMap<>();
        // Recorre el historial
        for (TodoHistory h : history) {
            // Solo considera las acciones de creación de tareas
            if ("CREATED".equals(h.getAction())) {
                // Convierte la fecha de creación a zona horaria local y obtiene año y mes
                java.time.ZonedDateTime zdt = h.getCreatedAt().atZone(java.time.ZoneId.systemDefault());
                String month = zdt.getYear() + "-" + String.format("%02d", zdt.getMonthValue()); // Formato YYYY-MM
                // Suma 1 al contador de ese mes
                monthCount.put(month, monthCount.getOrDefault(month, 0L) + 1);
            }
        }
        // Devuelve el mapa con la cantidad de tareas creadas por mes
        return monthCount;
    }

    // Devuelve el historial de acciones enriquecido con el nombre del usuario y descripciones amigables.
    public List<Map<String, Object>> getEnrichedHistoryByUser(String userId) {
        // Obtiene el historial de acciones del usuario ordenado por fecha descendente
        List<TodoHistory> history = todoHistoryRepository.findByUserIdOrderByActionAtDesc(userId);
        // Lista para almacenar el historial enriquecido
        List<Map<String, Object>> enrichedHistory = new java.util.ArrayList<>();

        // Recorre cada acción del historial
        for (TodoHistory h : history) {
            Map<String, Object> entry = new java.util.HashMap<>();
            entry.put("id", h.getId());
            entry.put("todoId", h.getTodoId());
            entry.put("userId", h.getUserId());

            // Obtener el nombre del usuario a partir del userId, si no existe pone 'Usuario desconocido'
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

            // Agregar una descripción más amigable de la acción realizada
            String actionDescription = getActionDescription(h.getAction(), h.getText());
            entry.put("actionDescription", actionDescription);

            // Agrega el mapa enriquecido a la lista
            enrichedHistory.add(entry);
        }

        // Devuelve la lista de acciones enriquecidas
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

package frc.bd.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import frc.bd.model.TodoHistory;

public interface TodoHistoryRepository extends MongoRepository<TodoHistory, String> {
    List<TodoHistory> findByUserIdOrderByActionAtDesc(String userId); // Devuelve el historial de tareas de un usuario, ordenado por la fecha de acción más reciente.
    List<TodoHistory> findByTodoIdOrderByActionAtDesc(String todoId); // Devuelve el historial de una tarea específica, ordenado por la fecha de acción más reciente.
    long countByUserIdAndActionAndActionAtBetween(String userId, String action, java.time.Instant from, java.time.Instant to); // Cuenta cuántas veces un usuario realizó una acción ej: "COMPLETED"

    // Consulta agregada para ranking de usuarios por tareas completadas
    @org.springframework.data.mongodb.repository.Aggregation(pipeline = {
        "{ '$match': { 'action': 'COMPLETED' } }",
        "{ '$group': { _id: '$userId', completedTasks: { $sum: 1 } } }"
    })
    List<UserCompletedCount> countCompletedTasksGroupByUser(); // Devuelve un ranking de usuarios con la cantidad de tareas completadas, agrupando por usuario.

    // Proyección para el resultado
    public static interface UserCompletedCount {
        String get_id();
        int getCompletedTasks();
    }
}

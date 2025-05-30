package frc.bd.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import frc.bd.model.TodoHistory;

public interface TodoHistoryRepository extends MongoRepository<TodoHistory, String> {
    List<TodoHistory> findByUserIdOrderByActionAtDesc(String userId);
    List<TodoHistory> findByTodoIdOrderByActionAtDesc(String todoId);
    long countByUserIdAndActionAndActionAtBetween(String userId, String action, java.time.Instant from, java.time.Instant to);

    // Consulta agregada para ranking de usuarios por tareas completadas
    @org.springframework.data.mongodb.repository.Aggregation(pipeline = {
        "{ '$match': { 'action': 'COMPLETED' } }",
        "{ '$group': { _id: '$userId', completedTasks: { $sum: 1 } } }"
    })
    List<UserCompletedCount> countCompletedTasksGroupByUser();

    // Proyección para el resultado
    public static interface UserCompletedCount {
        String get_id();
        int getCompletedTasks();
    }
}

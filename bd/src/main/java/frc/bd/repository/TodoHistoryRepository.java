package frc.bd.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import frc.bd.model.TodoHistory;

public interface TodoHistoryRepository extends MongoRepository<TodoHistory, String> {
    List<TodoHistory> findByUserIdOrderByActionAtDesc(String userId);
    List<TodoHistory> findByTodoIdOrderByActionAtDesc(String todoId);
}

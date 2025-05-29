package frc.bd.dto;

import java.time.Instant;

public class TodoHistoryDTO {
    private String id;
    private String todoId;
    private String userId;
    private String text;
    private boolean completed;
    private Instant createdAt;
    private Instant updatedAt;
    private String action;
    private Instant actionAt;

    public TodoHistoryDTO() {}

    public TodoHistoryDTO(String id, String todoId, String userId, String text, boolean completed, Instant createdAt, Instant updatedAt, String action, Instant actionAt) {
        this.id = id;
        this.todoId = todoId;
        this.userId = userId;
        this.text = text;
        this.completed = completed;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.action = action;
        this.actionAt = actionAt;
    }

    // Getters y setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getTodoId() { return todoId; }
    public void setTodoId(String todoId) { this.todoId = todoId; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public Instant getActionAt() { return actionAt; }
    public void setActionAt(Instant actionAt) { this.actionAt = actionAt; }
}

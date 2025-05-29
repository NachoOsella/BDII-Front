package frc.bd.dto;

import java.time.Instant;

public class TodoDTO {
    private String id;
    private String text;
    private boolean completed;
    private String userId;
    private Instant createdAt;
    private Instant updatedAt;

    public TodoDTO() {}
    public TodoDTO(String id, String text, boolean completed, String userId, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.text = text;
        this.completed = completed;
        this.userId = userId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    // Getters y setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getText() { return text; }
    public void setText(String text) { this.text = text; }
    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}

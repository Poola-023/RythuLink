package com.rythulink.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "crop_plan_progress",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"crop_id", "farmer_id", "task_id"})
    }
)
public class CropPlanProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "crop_id", nullable = false)
    private String cropId;

    @Column(name = "farmer_id", nullable = false)
    private String farmerId;

    @Column(name = "task_id", nullable = false)
    private String taskId;

    private boolean completed;

    private LocalDateTime completedAt;

    public CropPlanProgress() {
    }

    public CropPlanProgress(String cropId, String farmerId, String taskId, boolean completed) {
        this.cropId = cropId;
        this.farmerId = farmerId;
        this.taskId = taskId;
        this.completed = completed;
        this.completedAt = completed ? LocalDateTime.now() : null;
    }

    public Long getId() {
        return id;
    }

    public String getCropId() {
        return cropId;
    }

    public void setCropId(String cropId) {
        this.cropId = cropId;
    }

    public String getFarmerId() {
        return farmerId;
    }

    public void setFarmerId(String farmerId) {
        this.farmerId = farmerId;
    }

    public String getTaskId() {
        return taskId;
    }

    public void setTaskId(String taskId) {
        this.taskId = taskId;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
        this.completedAt = completed ? LocalDateTime.now() : null;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }
}
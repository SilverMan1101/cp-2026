package com.emotionsense.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "recommendations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Recommendation {

    @Id
    @Column(length = 64)
    private String id;

    @Column(name = "organization_id", nullable = false, length = 64)
    private String organizationId;

    @Column(name = "team_id", length = 64)
    private String teamId; // NULL means organization-wide

    @Column(nullable = false, length = 64)
    private String category; // WORKLOAD_BALANCING, TIME_OFF_LEAVE, SCHEDULE_OPTIMIZATION, TEAM_WELLNESS_ACTION

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String rationale;

    @Column(name = "action_type", nullable = false, length = 64)
    private String actionType;

    @Column(name = "estimated_impact", length = 32)
    @Builder.Default
    private String estimatedImpact = "MEDIUM"; // LOW, MEDIUM, HIGH

    @Column(length = 32)
    @Builder.Default
    private String status = "OPEN"; // OPEN, IN_PROGRESS, RESOLVED, DISMISSED

    @Column(name = "created_at")
    @Builder.Default
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at")
    @Builder.Default
    private Instant updatedAt = Instant.now();
}

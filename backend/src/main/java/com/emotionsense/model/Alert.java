package com.emotionsense.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "alerts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Alert {

    @Id
    @Column(length = 64)
    private String id;

    @Column(name = "organization_id", nullable = false, length = 64)
    private String organizationId;

    @Column(name = "team_id", length = 64)
    private String teamId;

    @Column(nullable = false, length = 32)
    private String severity; // INFO, WARNING, CRITICAL

    @Column(name = "alert_type", nullable = false, length = 64)
    private String alertType; // OVERTIME_SPIKE, WELLNESS_DROP, MEETING_SATURATION

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "is_acknowledged")
    @Builder.Default
    private Boolean isAcknowledged = false;

    @Column(name = "acknowledged_by", length = 64)
    private String acknowledgedBy;

    @Column(name = "acknowledged_at")
    private Instant acknowledgedAt;

    @Column(name = "triggered_at")
    @Builder.Default
    private Instant triggeredAt = Instant.now();
}

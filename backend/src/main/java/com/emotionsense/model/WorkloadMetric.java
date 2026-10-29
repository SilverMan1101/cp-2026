package com.emotionsense.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.Instant;

@Entity
@Table(name = "workload_metrics")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkloadMetric {

    @Id
    @Column(length = 64)
    private String id;

    @Column(name = "organization_id", nullable = false, length = 64)
    private String organizationId;

    @Column(name = "team_id", nullable = false, length = 64)
    private String teamId;

    @Column(name = "week_start_date", nullable = false)
    private LocalDate weekStartDate;

    @Column(name = "avg_weekly_hours", nullable = false)
    private Double avgWeeklyHours;

    @Column(name = "avg_overtime_hours", nullable = false)
    private Double avgOvertimeHours;

    @Column(name = "avg_meeting_hours", nullable = false)
    private Double avgMeetingHours;

    @Column(name = "weekend_active_hours", nullable = false)
    private Double weekendActiveHours;

    @Column(name = "focus_time_hours", nullable = false)
    private Double focusTimeHours;

    @Column(name = "after_hours_messages_count")
    @Builder.Default
    private Integer afterHoursMessagesCount = 0;

    @Column(name = "created_at")
    @Builder.Default
    private Instant createdAt = Instant.now();
}

package com.emotionsense.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "leave_records")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveRecord {

    @Id
    @Column(length = 64)
    private String id;

    @Column(name = "organization_id", nullable = false, length = 64)
    private String organizationId;

    @Column(name = "team_id", nullable = false, length = 64)
    private String teamId;

    @Column(name = "month_identifier", nullable = false, length = 10)
    private String monthIdentifier; // '2026-09'

    @Column(name = "total_planned_pto_days")
    @Builder.Default
    private Integer totalPlannedPtoDays = 0;

    @Column(name = "total_unplanned_sick_days")
    @Builder.Default
    private Integer totalUnplannedSickDays = 0;

    @Column(name = "pto_utilization_rate")
    @Builder.Default
    private Double ptoUtilizationRate = 0.0;

    @Column(name = "working_on_leave_events")
    @Builder.Default
    private Integer workingOnLeaveEvents = 0;

    @Column(name = "created_at")
    @Builder.Default
    private Instant createdAt = Instant.now();
}

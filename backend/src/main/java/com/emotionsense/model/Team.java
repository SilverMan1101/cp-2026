package com.emotionsense.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "teams")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Team {

    @Id
    @Column(length = 64)
    private String id;

    @Column(name = "organization_id", nullable = false, length = 64)
    private String organizationId;

    @Column(name = "department_id", nullable = false, length = 64)
    private String departmentId;

    @Column(nullable = false)
    private String name;

    @Column(name = "created_at")
    @Builder.Default
    private Instant createdAt = Instant.now();
}

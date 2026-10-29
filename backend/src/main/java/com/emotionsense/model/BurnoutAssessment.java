package com.emotionsense.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.Instant;

@Entity
@Table(name = "burnout_assessments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BurnoutAssessment {

    @Id
    @Column(length = 64)
    private String id;

    @Column(name = "organization_id", nullable = false, length = 64)
    private String organizationId;

    @Column(name = "team_id", nullable = false, length = 64)
    private String teamId;

    @Column(name = "assessment_date", nullable = false)
    private LocalDate assessmentDate;

    @Column(name = "burnout_risk_score", nullable = false)
    private Double burnoutRiskScore; // 0.0 to 100.0

    @Column(name = "wellness_index", nullable = false)
    private Double wellnessIndex; // 0.0 to 100.0

    @Column(name = "risk_category", nullable = false, length = 32)
    private String riskCategory; // LOW, MODERATE, HIGH

    @Column(name = "score_delta")
    @Builder.Default
    private Double scoreDelta = 0.0;

    @Column(name = "confidence_score")
    @Builder.Default
    private Double confidenceScore = 0.90;

    @Column(name = "primary_risk_driver")
    private String primaryRiskDriver;

    @Column(name = "contributing_factors", columnDefinition = "TEXT")
    private String contributingFactors; // JSON string of factors

    @Column(name = "model_version", length = 32)
    @Builder.Default
    private String modelVersion = "v1.0.0-rf-gb";

    @Column(name = "created_at")
    @Builder.Default
    private Instant createdAt = Instant.now();
}

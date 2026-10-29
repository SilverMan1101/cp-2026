package com.emotionsense.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "survey_responses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SurveyResponse {

    @Id
    @Column(length = 64)
    private String id;

    @Column(name = "survey_id", nullable = false, length = 64)
    private String surveyId;

    @Column(name = "organization_id", nullable = false, length = 64)
    private String organizationId;

    @Column(name = "team_id", nullable = false, length = 64)
    private String teamId;

    @Column(name = "pseudonymous_token_id", length = 64)
    private String pseudonymousTokenId;

    @Column(name = "exhaustion_score", nullable = false)
    private Double exhaustionScore; // 1.0 to 5.0

    @Column(name = "engagement_score", nullable = false)
    private Double engagementScore; // 1.0 to 5.0

    @Column(name = "workload_score", nullable = false)
    private Double workloadScore; // 1.0 to 5.0

    @Column(name = "support_score", nullable = false)
    private Double supportScore; // 1.0 to 5.0

    @Column(name = "feedback_text", columnDefinition = "TEXT")
    private String feedbackText;

    @Column(name = "sentiment_polarity")
    private Double sentimentPolarity; // -1.0 to +1.0

    @Column(name = "sentiment_label", length = 32)
    private String sentimentLabel; // POSITIVE, NEUTRAL, NEGATIVE

    @Column(name = "submitted_at")
    @Builder.Default
    private Instant submittedAt = Instant.now();
}

package com.emotionsense.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "survey_questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SurveyQuestion {

    @Id
    @Column(length = 64)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "survey_id", nullable = false)
    @JsonIgnore
    private Survey survey;

    @Column(nullable = false, length = 50)
    private String dimension; // EXHAUSTION, ENGAGEMENT, WORKLOAD, SUPPORT, AUTONOMY

    @Column(name = "prompt_text", nullable = false, columnDefinition = "TEXT")
    private String promptText;

    @Column(name = "scale_min")
    @Builder.Default
    private Integer scaleMin = 1;

    @Column(name = "scale_max")
    @Builder.Default
    private Integer scaleMax = 5;

    @Column(name = "sort_order")
    @Builder.Default
    private Integer sortOrder = 0;
}

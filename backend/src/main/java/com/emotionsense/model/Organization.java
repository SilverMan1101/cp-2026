package com.emotionsense.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "organizations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Organization {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String domain;

    @Column(name = "subscription_tier", length = 50)
    @Builder.Default
    private String subscriptionTier = "ENTERPRISE";

    @Column(name = "k_anonymity_threshold")
    @Builder.Default
    private Integer kAnonymityThreshold = 5;

    @Column(name = "created_at")
    @Builder.Default
    private Instant createdAt = Instant.now();
}

package com.emotionsense.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "pseudonymous_tokens")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PseudonymousToken {

    @Id
    @Column(length = 64)
    private String id;

    @Column(name = "organization_id", nullable = false, length = 64)
    private String organizationId;

    @Column(name = "team_id", nullable = false, length = 64)
    private String teamId;

    @Column(name = "token_hash", nullable = false, unique = true)
    private String tokenHash;

    @Column(name = "cycle_identifier", nullable = false, length = 64)
    private String cycleIdentifier;

    @Column(name = "created_at")
    @Builder.Default
    private Instant createdAt = Instant.now();
}

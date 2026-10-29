package com.emotionsense.repository;

import com.emotionsense.model.PseudonymousToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PseudonymousTokenRepository extends JpaRepository<PseudonymousToken, String> {
    Optional<PseudonymousToken> findByTokenHash(String tokenHash);
}

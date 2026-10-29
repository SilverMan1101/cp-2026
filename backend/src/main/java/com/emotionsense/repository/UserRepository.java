package com.emotionsense.repository;

import com.emotionsense.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByOrganizationIdAndEmail(String organizationId, String email);
    List<User> findByOrganizationId(String organizationId);
    List<User> findByTeamId(String teamId);
    long countByOrganizationId(String organizationId);
}

package com.emotionsense.repository;

import com.emotionsense.model.LeaveRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LeaveRecordRepository extends JpaRepository<LeaveRecord, String> {
    List<LeaveRecord> findByOrganizationId(String organizationId);
    List<LeaveRecord> findByTeamIdOrderByMonthIdentifierAsc(String teamId);
    Optional<LeaveRecord> findFirstByTeamIdOrderByMonthIdentifierDesc(String teamId);
}

package com.quizpractice.repository;

import com.quizpractice.entity.SystemSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SystemSettingRepository extends JpaRepository<SystemSetting, Long> {
    List<SystemSetting> findByType(String type);
    List<SystemSetting> findByTypeAndStatus(String type, String status);
    Optional<SystemSetting> findByTypeAndValue(String type, String value);
    List<SystemSetting> findByStatus(String status);
    List<SystemSetting> findByValueContainingIgnoreCase(String value);
}


package com.quizpractice.repository;

import com.quizpractice.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);

    @Query("SELECT u FROM User u WHERE " +
           "(:roleName IS NULL OR u.role.roleName = :roleName) AND " +
           "(:status IS NULL OR u.status = :status) AND " +
           "(:gender IS NULL OR u.gender = :gender) AND " +
           "(:search IS NULL OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) OR u.mobile LIKE CONCAT('%', :search, '%'))")
    Page<User> searchUsers(@Param("roleName") String roleName,
                           @Param("status") String status,
                           @Param("gender") String gender,
                           @Param("search") String search,
                           Pageable pageable);
}


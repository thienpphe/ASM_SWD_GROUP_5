package com.quizpractice.repository;

import com.quizpractice.entity.SubjectCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface SubjectCategoryRepository extends JpaRepository<SubjectCategory, Long> {
    Optional<SubjectCategory> findByCategoryName(String categoryName);
}


package com.quizpractice.repository;

import com.quizpractice.entity.Blog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {
    List<Blog> findTop5ByStatusOrderByCreatedAtDesc(String status);
    List<Blog> findByStatusAndIsFeaturedTrueOrderByCreatedAtDesc(String status);

    @Query("SELECT b FROM Blog b WHERE (:status IS NULL OR b.status = :status) " +
           "AND (:categoryId IS NULL OR b.category.categoryId = :categoryId) " +
           "AND (:search IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(b.briefInfo) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Blog> searchBlogs(@Param("status") String status,
                           @Param("categoryId") Long categoryId,
                           @Param("search") String search,
                           Pageable pageable);
}

package com.quizpractice.repository;

import com.quizpractice.entity.Slider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SliderRepository extends JpaRepository<Slider, Long> {
    List<Slider> findByStatusOrderByCreatedAtDesc(String status);
    List<Slider> findByTitleContainingIgnoreCase(String title);
}


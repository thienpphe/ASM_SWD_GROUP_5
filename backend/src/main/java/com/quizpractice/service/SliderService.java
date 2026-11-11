package com.quizpractice.service;

import com.quizpractice.dto.ContentDTOs.*;
import com.quizpractice.entity.*;
import com.quizpractice.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SliderService {

    @Autowired
    private SliderRepository sliderRepository;

    public List<Slider> getActiveSliders() {
        return sliderRepository.findByStatusOrderByCreatedAtDesc("Show");
    }

    public List<Slider> getAllSliders() {
        return sliderRepository.findAll();
    }

    public Slider getSlider(Long sliderId) {
        return sliderRepository.findById(sliderId)
                .orElseThrow(() -> new RuntimeException("Slider not found with id: " + sliderId));
    }

    @Transactional
    public Slider createSlider(SliderRequest request, User user) {
        Slider slider = new Slider();
        slider.setTitle(request.getTitle());
        slider.setImageUrl(request.getImageUrl());
        slider.setBacklink(request.getBacklink());
        slider.setStatus(request.getStatus() != null ? request.getStatus() : "Show");
        slider.setNotes(request.getNotes());
        slider.setCreatedBy(user);
        slider.setCreatedAt(LocalDateTime.now());
        slider.setUpdatedAt(LocalDateTime.now());
        return sliderRepository.save(slider);
    }

    @Transactional
    public Slider updateSlider(Long sliderId, SliderRequest request) {
        Slider slider = sliderRepository.findById(sliderId)
                .orElseThrow(() -> new RuntimeException("Slider not found"));

        if (request.getTitle() != null) slider.setTitle(request.getTitle());
        if (request.getImageUrl() != null) slider.setImageUrl(request.getImageUrl());
        if (request.getBacklink() != null) slider.setBacklink(request.getBacklink());
        if (request.getStatus() != null) slider.setStatus(request.getStatus());
        if (request.getNotes() != null) slider.setNotes(request.getNotes());
        slider.setUpdatedAt(LocalDateTime.now());

        return sliderRepository.save(slider);
    }

    @Transactional
    public Slider toggleSliderStatus(Long sliderId) {
        Slider slider = sliderRepository.findById(sliderId)
                .orElseThrow(() -> new RuntimeException("Slider not found"));
        slider.setStatus("Show".equalsIgnoreCase(slider.getStatus()) ? "Hide" : "Show");
        slider.setUpdatedAt(LocalDateTime.now());
        return sliderRepository.save(slider);
    }
}


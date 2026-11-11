package com.quizpractice.service;

import com.quizpractice.dto.ContentDTOs.*;
import com.quizpractice.entity.*;
import com.quizpractice.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SettingService {

    @Autowired
    private SystemSettingRepository settingRepository;

    public List<SystemSetting> getSettings(String type, String status, String search) {
        List<SystemSetting> list;
        if (type != null && !type.isEmpty()) {
            list = settingRepository.findByType(type);
        } else {
            list = settingRepository.findAll();
        }

        if (status != null && !status.isEmpty()) {
            list = list.stream().filter(s -> status.equalsIgnoreCase(s.getStatus())).collect(Collectors.toList());
        }

        if (search != null && !search.trim().isEmpty()) {
            String s = search.toLowerCase();
            list = list.stream().filter(st -> st.getValue().toLowerCase().contains(s)).collect(Collectors.toList());
        }

        return list;
    }

    public SystemSetting getSetting(Long settingId) {
        return settingRepository.findById(settingId)
                .orElseThrow(() -> new RuntimeException("Setting not found"));
    }

    @Transactional
    public SystemSetting createSetting(SettingRequest request) {
        SystemSetting s = new SystemSetting();
        s.setType(request.getType());
        s.setValue(request.getValue());
        s.setOrderNo(request.getOrderNo() != null ? request.getOrderNo() : 0);
        s.setDescription(request.getDescription());
        s.setStatus(request.getStatus() != null ? request.getStatus() : "Active");
        return settingRepository.save(s);
    }

    @Transactional
    public SystemSetting updateSetting(Long settingId, SettingRequest request) {
        SystemSetting s = settingRepository.findById(settingId)
                .orElseThrow(() -> new RuntimeException("Setting not found"));

        if (request.getType() != null) s.setType(request.getType());
        if (request.getValue() != null) s.setValue(request.getValue());
        if (request.getOrderNo() != null) s.setOrderNo(request.getOrderNo());
        if (request.getDescription() != null) s.setDescription(request.getDescription());
        if (request.getStatus() != null) s.setStatus(request.getStatus());

        return settingRepository.save(s);
    }

    @Transactional
    public SystemSetting toggleSettingStatus(Long settingId) {
        SystemSetting s = settingRepository.findById(settingId)
                .orElseThrow(() -> new RuntimeException("Setting not found"));
        s.setStatus("Active".equalsIgnoreCase(s.getStatus()) ? "Inactive" : "Active");
        return settingRepository.save(s);
    }
}


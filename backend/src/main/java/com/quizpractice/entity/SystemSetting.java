package com.quizpractice.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "System_Settings", uniqueConstraints = {
    @UniqueConstraint(name = "UQ_System_Settings", columnNames = {"type", "value"})
})
public class SystemSetting {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "setting_id")
    private Long settingId;

    @Column(name = "type", length = 30, nullable = false)
    private String type;

    @Column(name = "value", length = 100, nullable = false)
    private String value;

    @Column(name = "order_no", nullable = false)
    private Integer orderNo = 0;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "status", length = 10, nullable = false)
    private String status = "Active";

    public SystemSetting() {}

    public SystemSetting(String type, String value, Integer orderNo, String description, String status) {
        this.type = type;
        this.value = value;
        this.orderNo = orderNo;
        this.description = description;
        this.status = status;
    }

    public Long getSettingId() { return settingId; }
    public void setSettingId(Long settingId) { this.settingId = settingId; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getValue() { return value; }
    public void setValue(String value) { this.value = value; }
    public Integer getOrderNo() { return orderNo; }
    public void setOrderNo(Integer orderNo) { this.orderNo = orderNo; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}


package com.quizpractice.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Subject_Dimensions", uniqueConstraints = {
    @UniqueConstraint(name = "UQ_Subject_Dimensions", columnNames = {"subject_id", "dimension_type_id", "dimension_name"})
})
public class SubjectDimension {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "dimension_id")
    private Long dimensionId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "dimension_type_id", nullable = false)
    private SystemSetting dimensionType;

    @Column(name = "dimension_name", length = 100, nullable = false)
    private String dimensionName;

    @Column(name = "description", length = 500)
    private String description;

    public SubjectDimension() {}

    public Long getDimensionId() { return dimensionId; }
    public void setDimensionId(Long dimensionId) { this.dimensionId = dimensionId; }
    public Subject getSubject() { return subject; }
    public void setSubject(Subject subject) { this.subject = subject; }
    public SystemSetting getDimensionType() { return dimensionType; }
    public void setDimensionType(SystemSetting dimensionType) { this.dimensionType = dimensionType; }
    public String getDimensionName() { return dimensionName; }
    public void setDimensionName(String dimensionName) { this.dimensionName = dimensionName; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}


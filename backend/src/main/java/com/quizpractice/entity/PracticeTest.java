package com.quizpractice.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Practice_Tests")
public class PracticeTest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "practice_id")
    private Long practiceId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "subject_id", nullable = false)
    private Subject subject;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "topic_id")
    private Lesson topic;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "dimension_id")
    private SubjectDimension dimension;

    @Column(name = "question_count", nullable = false)
    private Integer questionCount = 10;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "status", length = 20, nullable = false)
    private String status = "Created"; // Created, InProgress, Completed

    @Column(name = "question_level", length = 20)
    private String questionLevel; // Any, Easy, Medium, Hard

    public PracticeTest() {}

    public Long getPracticeId() { return practiceId; }
    public void setPracticeId(Long practiceId) { this.practiceId = practiceId; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Subject getSubject() { return subject; }
    public void setSubject(Subject subject) { this.subject = subject; }
    public Lesson getTopic() { return topic; }
    public void setTopic(Lesson topic) { this.topic = topic; }
    public SubjectDimension getDimension() { return dimension; }
    public void setDimension(SubjectDimension dimension) { this.dimension = dimension; }
    public Integer getQuestionCount() { return questionCount; }
    public void setQuestionCount(Integer questionCount) { this.questionCount = questionCount; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getQuestionLevel() { return questionLevel; }
    public void setQuestionLevel(String questionLevel) { this.questionLevel = questionLevel; }
}


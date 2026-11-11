package com.quizpractice.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Test_Sessions")
public class TestSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "session_id")
    private Long sessionId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "test_type", length = 20, nullable = false)
    private String testType; // Practice, Simulation

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "practice_id")
    private PracticeTest practice;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "exam_id")
    private Quiz exam;

    @Column(name = "started_at", nullable = false)
    private LocalDateTime startedAt = LocalDateTime.now();

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Column(name = "status", length = 20, nullable = false)
    private String status = "InProgress"; // InProgress, Submitted, Cancelled

    @Column(name = "current_question_no")
    private Integer currentQuestionNo = 1;

    @Column(name = "duration_seconds")
    private Integer durationSeconds = 0;

    @Column(name = "question_order_snapshot", columnDefinition = "TEXT")
    private String questionOrderSnapshot; // Comma separated question IDs

    public TestSession() {}

    public Long getSessionId() { return sessionId; }
    public void setSessionId(Long sessionId) { this.sessionId = sessionId; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getTestType() { return testType; }
    public void setTestType(String testType) { this.testType = testType; }
    public PracticeTest getPractice() { return practice; }
    public void setPractice(PracticeTest practice) { this.practice = practice; }
    public Quiz getExam() { return exam; }
    public void setExam(Quiz exam) { this.exam = exam; }
    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }
    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }
    public LocalDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Integer getCurrentQuestionNo() { return currentQuestionNo; }
    public void setCurrentQuestionNo(Integer currentQuestionNo) { this.currentQuestionNo = currentQuestionNo; }
    public Integer getDurationSeconds() { return durationSeconds; }
    public void setDurationSeconds(Integer durationSeconds) { this.durationSeconds = durationSeconds; }
    public String getQuestionOrderSnapshot() { return questionOrderSnapshot; }
    public void setQuestionOrderSnapshot(String questionOrderSnapshot) { this.questionOrderSnapshot = questionOrderSnapshot; }
}


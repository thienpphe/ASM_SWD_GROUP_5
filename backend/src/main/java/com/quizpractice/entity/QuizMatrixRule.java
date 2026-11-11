package com.quizpractice.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Quiz_Matrix_Rules")
public class QuizMatrixRule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rule_id")
    private Long ruleId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "dimension_id")
    private SubjectDimension dimension;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;

    @Column(name = "question_level", length = 20)
    private String questionLevel = "Any"; // Any, Easy, Medium, Hard

    @Column(name = "number_of_questions", nullable = false)
    private Integer numberOfQuestions = 1;

    public QuizMatrixRule() {}

    public Long getRuleId() { return ruleId; }
    public void setRuleId(Long ruleId) { this.ruleId = ruleId; }
    public Quiz getQuiz() { return quiz; }
    public void setQuiz(Quiz quiz) { this.quiz = quiz; }
    public SubjectDimension getDimension() { return dimension; }
    public void setDimension(SubjectDimension dimension) { this.dimension = dimension; }
    public Lesson getLesson() { return lesson; }
    public void setLesson(Lesson lesson) { this.lesson = lesson; }
    public String getQuestionLevel() { return questionLevel; }
    public void setQuestionLevel(String questionLevel) { this.questionLevel = questionLevel; }
    public Integer getNumberOfQuestions() { return numberOfQuestions; }
    public void setNumberOfQuestions(Integer numberOfQuestions) { this.numberOfQuestions = numberOfQuestions; }
}


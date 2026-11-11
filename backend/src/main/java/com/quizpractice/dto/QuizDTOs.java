package com.quizpractice.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class QuizDTOs {

    public static class PracticeCreateRequest {
        private Long subjectId;
        private Long topicId;
        private Long dimensionId;
        private Integer questionCount = 10;
        private String level = "Medium";

        public PracticeCreateRequest() {}
        public Long getSubjectId() { return subjectId; }
        public void setSubjectId(Long subjectId) { this.subjectId = subjectId; }
        public Long getTopicId() { return topicId; }
        public void setTopicId(Long topicId) { this.topicId = topicId; }
        public Long getDimensionId() { return dimensionId; }
        public void setDimensionId(Long dimensionId) { this.dimensionId = dimensionId; }
        public Integer getQuestionCount() { return questionCount; }
        public void setQuestionCount(Integer questionCount) { this.questionCount = questionCount; }
        public String getLevel() { return level; }
        public void setLevel(String level) { this.level = level; }
    }

    public static class SessionStartResponse {
        private Long sessionId;
        private String testType;
        private String title;
        private String subjectName;
        private Integer durationMinutes;
        private Integer remainingSeconds;
        private Integer totalQuestions;
        private Integer currentQuestionNo;

        public SessionStartResponse() {}

        public Long getSessionId() { return sessionId; }
        public void setSessionId(Long sessionId) { this.sessionId = sessionId; }
        public String getTestType() { return testType; }
        public void setTestType(String testType) { this.testType = testType; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getSubjectName() { return subjectName; }
        public void setSubjectName(String subjectName) { this.subjectName = subjectName; }
        public Integer getDurationMinutes() { return durationMinutes; }
        public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }
        public Integer getRemainingSeconds() { return remainingSeconds; }
        public void setRemainingSeconds(Integer remainingSeconds) { this.remainingSeconds = remainingSeconds; }
        public Integer getTotalQuestions() { return totalQuestions; }
        public void setTotalQuestions(Integer totalQuestions) { this.totalQuestions = totalQuestions; }
        public Integer getCurrentQuestionNo() { return currentQuestionNo; }
        public void setCurrentQuestionNo(Integer currentQuestionNo) { this.currentQuestionNo = currentQuestionNo; }
    }

    public static class OptionViewDTO {
        private Long optionId;
        private String optionText;
        private Integer orderIndex;

        public OptionViewDTO() {}
        public OptionViewDTO(Long optionId, String optionText, Integer orderIndex) {
            this.optionId = optionId;
            this.optionText = optionText;
            this.orderIndex = orderIndex;
        }

        public Long getOptionId() { return optionId; }
        public void setOptionId(Long optionId) { this.optionId = optionId; }
        public String getOptionText() { return optionText; }
        public void setOptionText(String optionText) { this.optionText = optionText; }
        public Integer getOrderIndex() { return orderIndex; }
        public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }
    }

    public static class QuestionViewDTO {
        private Long questionId;
        private Integer orderNo;
        private Integer totalQuestions;
        private String content;
        private String level;
        private String mediaUrl;
        private String mediaType;
        private List<OptionViewDTO> options;
        private Long selectedOptionId;
        private Boolean isMarked = false;
        // Used only when peek answer is allowed (Practice mode)
        private String peekCorrectAnswer;
        private String peekExplanation;

        public QuestionViewDTO() {}

        public Long getQuestionId() { return questionId; }
        public void setQuestionId(Long questionId) { this.questionId = questionId; }
        public Integer getOrderNo() { return orderNo; }
        public void setOrderNo(Integer orderNo) { this.orderNo = orderNo; }
        public Integer getTotalQuestions() { return totalQuestions; }
        public void setTotalQuestions(Integer totalQuestions) { this.totalQuestions = totalQuestions; }
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
        public String getLevel() { return level; }
        public void setLevel(String level) { this.level = level; }
        public String getMediaUrl() { return mediaUrl; }
        public void setMediaUrl(String mediaUrl) { this.mediaUrl = mediaUrl; }
        public String getMediaType() { return mediaType; }
        public void setMediaType(String mediaType) { this.mediaType = mediaType; }
        public List<OptionViewDTO> getOptions() { return options; }
        public void setOptions(List<OptionViewDTO> options) { this.options = options; }
        public Long getSelectedOptionId() { return selectedOptionId; }
        public void setSelectedOptionId(Long selectedOptionId) { this.selectedOptionId = selectedOptionId; }
        public Boolean getIsMarked() { return isMarked; }
        public void setIsMarked(Boolean isMarked) { this.isMarked = isMarked; }
        public String getPeekCorrectAnswer() { return peekCorrectAnswer; }
        public void setPeekCorrectAnswer(String peekCorrectAnswer) { this.peekCorrectAnswer = peekCorrectAnswer; }
        public String getPeekExplanation() { return peekExplanation; }
        public void setPeekExplanation(String peekExplanation) { this.peekExplanation = peekExplanation; }
    }

    public static class AnswerSubmitRequest {
        private Long questionId;
        private Long selectedOptionId;
        private Boolean isMarked;

        public AnswerSubmitRequest() {}
        public Long getQuestionId() { return questionId; }
        public void setQuestionId(Long questionId) { this.questionId = questionId; }
        public Long getSelectedOptionId() { return selectedOptionId; }
        public void setSelectedOptionId(Long selectedOptionId) { this.selectedOptionId = selectedOptionId; }
        public Boolean getIsMarked() { return isMarked; }
        public void setIsMarked(Boolean isMarked) { this.isMarked = isMarked; }
    }

    public static class QuestionProgressItem {
        private Long questionId;
        private Integer orderNo;
        private String status; // ANSWERED, UNANSWERED, MARKED

        public QuestionProgressItem() {}
        public QuestionProgressItem(Long questionId, Integer orderNo, String status) {
            this.questionId = questionId;
            this.orderNo = orderNo;
            this.status = status;
        }

        public Long getQuestionId() { return questionId; }
        public void setQuestionId(Long questionId) { this.questionId = questionId; }
        public Integer getOrderNo() { return orderNo; }
        public void setOrderNo(Integer orderNo) { this.orderNo = orderNo; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    public static class ExamProgressDTO {
        private int totalQuestions;
        private int answeredCount;
        private int unansweredCount;
        private int markedCount;
        private List<QuestionProgressItem> questions;

        public ExamProgressDTO() {}
        public int getTotalQuestions() { return totalQuestions; }
        public void setTotalQuestions(int totalQuestions) { this.totalQuestions = totalQuestions; }
        public int getAnsweredCount() { return answeredCount; }
        public void setAnsweredCount(int answeredCount) { this.answeredCount = answeredCount; }
        public int getUnansweredCount() { return unansweredCount; }
        public void setUnansweredCount(int unansweredCount) { this.unansweredCount = unansweredCount; }
        public int getMarkedCount() { return markedCount; }
        public void setMarkedCount(int markedCount) { this.markedCount = markedCount; }
        public List<QuestionProgressItem> getQuestions() { return questions; }
        public void setQuestions(List<QuestionProgressItem> questions) { this.questions = questions; }
    }

    public static class ExamResultDTO {
        private Long resultId;
        private Long sessionId;
        private String testType;
        private String title;
        private String subjectName;
        private Integer totalQuestions;
        private Integer answeredCount;
        private Integer correctCount;
        private Integer incorrectCount;
        private Integer unansweredCount;
        private BigDecimal score;
        private Boolean isPassed;
        private LocalDateTime submittedAt;
        private Integer durationSeconds;

        public ExamResultDTO() {}

        public Long getResultId() { return resultId; }
        public void setResultId(Long resultId) { this.resultId = resultId; }
        public Long getSessionId() { return sessionId; }
        public void setSessionId(Long sessionId) { this.sessionId = sessionId; }
        public String getTestType() { return testType; }
        public void setTestType(String testType) { this.testType = testType; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getSubjectName() { return subjectName; }
        public void setSubjectName(String subjectName) { this.subjectName = subjectName; }
        public Integer getTotalQuestions() { return totalQuestions; }
        public void setTotalQuestions(Integer totalQuestions) { this.totalQuestions = totalQuestions; }
        public Integer getAnsweredCount() { return answeredCount; }
        public void setAnsweredCount(Integer answeredCount) { this.answeredCount = answeredCount; }
        public Integer getCorrectCount() { return correctCount; }
        public void setCorrectCount(Integer correctCount) { this.correctCount = correctCount; }
        public Integer getIncorrectCount() { return incorrectCount; }
        public void setIncorrectCount(Integer incorrectCount) { this.incorrectCount = incorrectCount; }
        public Integer getUnansweredCount() { return unansweredCount; }
        public void setUnansweredCount(Integer unansweredCount) { this.unansweredCount = unansweredCount; }
        public BigDecimal getScore() { return score; }
        public void setScore(BigDecimal score) { this.score = score; }
        public Boolean getIsPassed() { return isPassed; }
        public void setIsPassed(Boolean isPassed) { this.isPassed = isPassed; }
        public LocalDateTime getSubmittedAt() { return submittedAt; }
        public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
        public Integer getDurationSeconds() { return durationSeconds; }
        public void setDurationSeconds(Integer durationSeconds) { this.durationSeconds = durationSeconds; }
    }

    public static class ReviewOptionDTO {
        private Long optionId;
        private String optionText;
        private Boolean isCorrect;
        private Integer orderIndex;

        public ReviewOptionDTO() {}
        public ReviewOptionDTO(Long optionId, String optionText, Boolean isCorrect, Integer orderIndex) {
            this.optionId = optionId;
            this.optionText = optionText;
            this.isCorrect = isCorrect;
            this.orderIndex = orderIndex;
        }

        public Long getOptionId() { return optionId; }
        public void setOptionId(Long optionId) { this.optionId = optionId; }
        public String getOptionText() { return optionText; }
        public void setOptionText(String optionText) { this.optionText = optionText; }
        public Boolean getIsCorrect() { return isCorrect; }
        public void setIsCorrect(Boolean isCorrect) { this.isCorrect = isCorrect; }
        public Integer getOrderIndex() { return orderIndex; }
        public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }
    }

    public static class ReviewQuestionDTO {
        private Long questionId;
        private Integer orderNo;
        private String content;
        private String level;
        private String mediaUrl;
        private String mediaType;
        private List<ReviewOptionDTO> options;
        private Long selectedOptionId;
        private Long correctOptionId;
        private Boolean isCorrect;
        private Boolean isMarked;
        private String status; // CORRECT, INCORRECT, UNANSWERED
        private String explanation;

        public ReviewQuestionDTO() {}

        public Long getQuestionId() { return questionId; }
        public void setQuestionId(Long questionId) { this.questionId = questionId; }
        public Integer getOrderNo() { return orderNo; }
        public void setOrderNo(Integer orderNo) { this.orderNo = orderNo; }
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
        public String getLevel() { return level; }
        public void setLevel(String level) { this.level = level; }
        public String getMediaUrl() { return mediaUrl; }
        public void setMediaUrl(String mediaUrl) { this.mediaUrl = mediaUrl; }
        public String getMediaType() { return mediaType; }
        public void setMediaType(String mediaType) { this.mediaType = mediaType; }
        public List<ReviewOptionDTO> getOptions() { return options; }
        public void setOptions(List<ReviewOptionDTO> options) { this.options = options; }
        public Long getSelectedOptionId() { return selectedOptionId; }
        public void setSelectedOptionId(Long selectedOptionId) { this.selectedOptionId = selectedOptionId; }
        public Long getCorrectOptionId() { return correctOptionId; }
        public void setCorrectOptionId(Long correctOptionId) { this.correctOptionId = correctOptionId; }
        public Boolean getIsCorrect() { return isCorrect; }
        public void setIsCorrect(Boolean isCorrect) { this.isCorrect = isCorrect; }
        public Boolean getIsMarked() { return isMarked; }
        public void setIsMarked(Boolean isMarked) { this.isMarked = isMarked; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getExplanation() { return explanation; }
        public void setExplanation(String explanation) { this.explanation = explanation; }
    }
}


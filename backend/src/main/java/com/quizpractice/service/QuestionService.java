package com.quizpractice.service;

import com.quizpractice.dto.ContentDTOs.*;
import com.quizpractice.entity.*;
import com.quizpractice.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private QuestionOptionRepository optionRepository;

    @Autowired
    private QuestionMediaRepository mediaRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private SubjectDimensionRepository dimensionRepository;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuizQuestionMappingRepository mappingRepository;

    @Autowired
    private QuizMatrixRuleRepository matrixRuleRepository;

    @Autowired
    private TestSessionRepository sessionRepository;

    public Page<Question> searchQuestions(Long subjectId, Long lessonId, Long dimensionId, String level, String status, String search, Pageable pageable) {
        return questionRepository.searchQuestions(subjectId, lessonId, dimensionId, level, status, search, pageable);
    }

    public Question getQuestion(Long questionId) {
        return questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found with id: " + questionId));
    }

    @Transactional
    public Question createQuestion(QuestionRequest request, User currentUser) {
        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        Question q = new Question();
        q.setSubject(subject);
        if (request.getLessonId() != null) {
            Lesson l = lessonRepository.findById(request.getLessonId()).orElse(null);
            q.setLesson(l);
        }
        if (request.getDimensionId() != null) {
            SubjectDimension d = dimensionRepository.findById(request.getDimensionId()).orElse(null);
            q.setDimension(d);
        }
        q.setContent(request.getContent());
        q.setLevel(request.getLevel() != null ? request.getLevel() : "Medium");
        q.setStatus(request.getStatus() != null ? request.getStatus() : "Published");
        q.setExplanation(request.getExplanation());
        q.setCreatedBy(currentUser);
        q.setCreatedAt(LocalDateTime.now());
        q = questionRepository.save(q);

        if (request.getOptions() != null && !request.getOptions().isEmpty()) {
            int order = 1;
            for (OptionItem optItem : request.getOptions()) {
                QuestionOption opt = new QuestionOption();
                opt.setQuestion(q);
                opt.setOptionText(optItem.getOptionText());
                opt.setIsCorrect(optItem.getIsCorrect() != null ? optItem.getIsCorrect() : false);
                opt.setExplanation(optItem.getExplanation());
                opt.setOrderIndex(order++);
                optionRepository.save(opt);
            }
        }

        if (request.getMediaUrl() != null && !request.getMediaUrl().trim().isEmpty()) {
            QuestionMedia media = new QuestionMedia();
            media.setQuestion(q);
            media.setMediaUrl(request.getMediaUrl());
            media.setMediaType(request.getMediaType() != null ? request.getMediaType() : "IMAGE");
            media.setOrderIndex(1);
            mediaRepository.save(media);
        }

        return q;
    }

    @Transactional
    public Question updateQuestion(Long questionId, QuestionRequest request, User currentUser) {
        Question q = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        if (request.getContent() != null) q.setContent(request.getContent());
        if (request.getLevel() != null) q.setLevel(request.getLevel());
        if (request.getStatus() != null) q.setStatus(request.getStatus());
        if (request.getExplanation() != null) q.setExplanation(request.getExplanation());
        if (request.getLessonId() != null) {
            Lesson l = lessonRepository.findById(request.getLessonId()).orElse(null);
            q.setLesson(l);
        }
        if (request.getDimensionId() != null) {
            SubjectDimension d = dimensionRepository.findById(request.getDimensionId()).orElse(null);
            q.setDimension(d);
        }
        q.setUpdatedAt(LocalDateTime.now());

        if (request.getOptions() != null) {
            q.getOptions().clear();
            int order = 1;
            for (OptionItem optItem : request.getOptions()) {
                QuestionOption opt = new QuestionOption();
                opt.setQuestion(q);
                opt.setOptionText(optItem.getOptionText());
                opt.setIsCorrect(optItem.getIsCorrect() != null ? optItem.getIsCorrect() : false);
                opt.setExplanation(optItem.getExplanation());
                opt.setOrderIndex(order++);
                q.getOptions().add(opt);
            }
        }

        return questionRepository.save(q);
    }

    @Transactional
    public void deleteQuestion(Long questionId) {
        questionRepository.deleteById(questionId);
    }

    @Transactional
    public Question toggleQuestionStatus(Long questionId) {
        Question q = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));
        if ("Published".equalsIgnoreCase(q.getStatus())) {
            q.setStatus("Hidden");
        } else {
            q.setStatus("Published");
        }
        q.setUpdatedAt(LocalDateTime.now());
        return questionRepository.save(q);
    }

    // Question Import: parses lines of Question | OptA | OptB | OptC | OptD | CorrectKey(A/B/C/D) | Explanation
    @Transactional
    public int importQuestions(Long subjectId, String rawContent, User currentUser) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        int count = 0;
        String[] lines = rawContent.split("\r?\n");
        for (String line : lines) {
            line = line.trim();
            if (line.isEmpty() || line.startsWith("#") || line.toLowerCase().startsWith("question")) continue;

            String[] parts = line.split("\\|");
            if (parts.length < 6) continue;

            String qText = parts[0].trim();
            String optA = parts[1].trim();
            String optB = parts[2].trim();
            String optC = parts[3].trim();
            String optD = parts[4].trim();
            String correctKey = parts[5].trim().toUpperCase();
            String expl = parts.length > 6 ? parts[6].trim() : "Detailed explanation for this question";

            Question q = new Question();
            q.setSubject(subject);
            q.setContent(qText);
            q.setLevel("Medium");
            q.setStatus("Published");
            q.setExplanation(expl);
            q.setCreatedBy(currentUser);
            q.setCreatedAt(LocalDateTime.now());
            q = questionRepository.save(q);

            QuestionOption a = new QuestionOption(q, optA, "A".equals(correctKey), 1);
            QuestionOption b = new QuestionOption(q, optB, "B".equals(correctKey), 2);
            QuestionOption c = new QuestionOption(q, optC, "C".equals(correctKey), 3);
            QuestionOption d = new QuestionOption(q, optD, "D".equals(correctKey), 4);
            optionRepository.saveAll(Arrays.asList(a, b, c, d));

            count++;
        }
        return count;
    }

    // Quizzes Management
    public Page<Quiz> searchQuizzes(Long subjectId, String testType, String search, Pageable pageable) {
        return quizRepository.searchQuizzes(subjectId, testType, search, pageable);
    }

    public Map<String, Object> getQuizDetails(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));
        List<QuizMatrixRule> rules = matrixRuleRepository.findByQuiz_QuizId(quizId);
        List<QuizQuestionMapping> mappings = mappingRepository.findByQuiz_QuizIdOrderByOrderIndexAsc(quizId);

        Map<String, Object> map = new HashMap<>();
        map.put("quiz", quiz);
        map.put("rules", rules);
        map.put("mappings", mappings);
        return map;
    }

    @Transactional
    public Quiz createQuiz(QuizRequest request, User currentUser) {
        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        Quiz quiz = new Quiz();
        quiz.setSubject(subject);
        quiz.setQuizName(request.getQuizName());
        quiz.setTestType(request.getTestType() != null ? request.getTestType() : "Simulation");
        quiz.setLevel(request.getLevel() != null ? request.getLevel() : "Medium");
        quiz.setDuration(request.getDuration() != null ? request.getDuration() : 60);
        quiz.setPassRate(request.getPassRate() != null ? request.getPassRate() : new java.math.BigDecimal("70.00"));
        quiz.setTotalQuestions(request.getTotalQuestions() != null ? request.getTotalQuestions() : 10);
        quiz.setStatus(request.getStatus() != null ? request.getStatus() : "Published");
        quiz.setDescription(request.getDescription());
        quiz.setCreatedBy(currentUser);
        quiz.setCreatedAt(LocalDateTime.now());
        quiz = quizRepository.save(quiz);

        if (request.getMatrixRules() != null && !request.getMatrixRules().isEmpty()) {
            for (MatrixRuleItem item : request.getMatrixRules()) {
                QuizMatrixRule rule = new QuizMatrixRule();
                rule.setQuiz(quiz);
                if (item.getDimensionId() != null) {
                    SubjectDimension dim = dimensionRepository.findById(item.getDimensionId()).orElse(null);
                    rule.setDimension(dim);
                }
                if (item.getLessonId() != null) {
                    Lesson l = lessonRepository.findById(item.getLessonId()).orElse(null);
                    rule.setLesson(l);
                }
                rule.setQuestionLevel(item.getQuestionLevel());
                rule.setNumberOfQuestions(item.getNumberOfQuestions() != null ? item.getNumberOfQuestions() : 1);
                matrixRuleRepository.save(rule);
            }
        }

        return quiz;
    }

    @Transactional
    public Quiz updateQuiz(Long quizId, QuizRequest request) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        // Check if any test taken
        boolean hasTestTaken = sessionRepository.findAll().stream()
                .anyMatch(s -> s.getExam() != null && s.getExam().getQuizId().equals(quizId));
        if (hasTestTaken) {
            throw new RuntimeException("Cannot edit quiz because students have already taken tests with this quiz!");
        }

        if (request.getQuizName() != null) quiz.setQuizName(request.getQuizName());
        if (request.getTestType() != null) quiz.setTestType(request.getTestType());
        if (request.getLevel() != null) quiz.setLevel(request.getLevel());
        if (request.getDuration() != null) quiz.setDuration(request.getDuration());
        if (request.getPassRate() != null) quiz.setPassRate(request.getPassRate());
        if (request.getTotalQuestions() != null) quiz.setTotalQuestions(request.getTotalQuestions());
        if (request.getStatus() != null) quiz.setStatus(request.getStatus());
        if (request.getDescription() != null) quiz.setDescription(request.getDescription());
        quiz.setUpdatedAt(LocalDateTime.now());

        if (request.getMatrixRules() != null) {
            matrixRuleRepository.deleteByQuiz_QuizId(quizId);
            for (MatrixRuleItem item : request.getMatrixRules()) {
                QuizMatrixRule rule = new QuizMatrixRule();
                rule.setQuiz(quiz);
                if (item.getDimensionId() != null) {
                    rule.setDimension(dimensionRepository.findById(item.getDimensionId()).orElse(null));
                }
                if (item.getLessonId() != null) {
                    rule.setLesson(lessonRepository.findById(item.getLessonId()).orElse(null));
                }
                rule.setQuestionLevel(item.getQuestionLevel());
                rule.setNumberOfQuestions(item.getNumberOfQuestions() != null ? item.getNumberOfQuestions() : 1);
                matrixRuleRepository.save(rule);
            }
        }

        return quizRepository.save(quiz);
    }

    @Transactional
    public void deleteQuiz(Long quizId) {
        boolean hasTestTaken = sessionRepository.findAll().stream()
                .anyMatch(s -> s.getExam() != null && s.getExam().getQuizId().equals(quizId));
        if (hasTestTaken) {
            throw new RuntimeException("Cannot delete quiz because tests have already been taken with this quiz!");
        }
        quizRepository.deleteById(quizId);
    }
}


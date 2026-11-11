package com.quizpractice.service;

import com.quizpractice.dto.QuizDTOs.*;
import com.quizpractice.entity.*;
import com.quizpractice.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class QuizPracticeService {

    @Autowired
    private TestSessionRepository sessionRepository;

    @Autowired
    private PracticeTestRepository practiceRepository;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private QuestionOptionRepository optionRepository;

    @Autowired
    private UserAnswerRepository userAnswerRepository;

    @Autowired
    private ExamResultRepository examResultRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private SubjectDimensionRepository dimensionRepository;

    @Autowired
    private QuizQuestionMappingRepository mappingRepository;

    @Autowired
    private UserRegistrationRepository registrationRepository;

    // Customer: List Practices
    public List<Map<String, Object>> listUserPractices(User user) {
        List<TestSession> sessions = sessionRepository.findByUser_UserIdOrderByStartedAtDesc(user.getUserId());
        List<Map<String, Object>> list = new ArrayList<>();

        for (TestSession s : sessions) {
            Map<String, Object> map = new HashMap<>();
            map.put("sessionId", s.getSessionId());
            map.put("testType", s.getTestType());
            map.put("startedAt", s.getStartedAt());
            map.put("status", s.getStatus());

            String subjectName = "";
            String examName = "";
            if (s.getPractice() != null) {
                subjectName = s.getPractice().getSubject().getSubjectName();
                examName = "Practice: " + (s.getPractice().getTopic() != null ? s.getPractice().getTopic().getLessonName() : "General Practice");
            } else if (s.getExam() != null) {
                subjectName = s.getExam().getSubject().getSubjectName();
                examName = s.getExam().getQuizName();
            }
            map.put("subjectName", subjectName);
            map.put("examName", examName);

            ExamResult result = examResultRepository.findBySession_SessionId(s.getSessionId()).orElse(null);
            if (result != null) {
                map.put("totalQuestions", result.getTotalQuestions());
                map.put("correctCount", result.getCorrectCount());
                map.put("score", result.getScore());
                map.put("isPassed", result.getIsPassed());
                map.put("submittedAt", result.getSubmittedAt());
            } else {
                map.put("totalQuestions", parseQuestionIds(s.getQuestionOrderSnapshot()).size());
                map.put("correctCount", 0);
                map.put("score", BigDecimal.ZERO);
                map.put("isPassed", false);
            }

            int dur = s.getDurationSeconds() != null ? s.getDurationSeconds() : 0;
            if (s.getSubmittedAt() != null) {
                dur = (int) Duration.between(s.getStartedAt(), s.getSubmittedAt()).getSeconds();
            }
            long hours = dur / 3600;
            long mins = (dur % 3600) / 60;
            long secs = dur % 60;
            map.put("durationFormatted", String.format("%02d:%02d:%02d", hours, mins, secs));

            list.add(map);
        }
        return list;
    }

    // Customer: List accessible subjects for creating new practice
    public List<Subject> getAccessibleSubjects(User user) {
        List<UserRegistration> regs = registrationRepository.findByUser_UserIdOrderByRegistrationTimeDesc(user.getUserId());
        Set<Long> registeredSubjectIds = regs.stream()
                .filter(r -> "Paid".equalsIgnoreCase(r.getStatus()))
                .map(r -> r.getSubject().getSubjectId())
                .collect(Collectors.toSet());

        // Also if user has no paid registrations yet, allow all published subjects for demo/practice access
        if (registeredSubjectIds.isEmpty()) {
            return subjectRepository.findByStatus("Published");
        }
        return subjectRepository.findAllById(registeredSubjectIds);
    }

    // Customer: Create Practice Test
    @Transactional
    public SessionStartResponse createPracticeSession(PracticeCreateRequest request, User user) {
        Subject subject = subjectRepository.findById(request.getSubjectId())
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        Lesson topic = request.getTopicId() != null ? lessonRepository.findById(request.getTopicId()).orElse(null) : null;
        SubjectDimension dimension = request.getDimensionId() != null ? dimensionRepository.findById(request.getDimensionId()).orElse(null) : null;

        int reqCount = request.getQuestionCount() != null && request.getQuestionCount() > 0 ? request.getQuestionCount() : 10;

        List<Question> availableQuestions;
        if (topic != null) {
            availableQuestions = questionRepository.findByLesson_LessonId(topic.getLessonId());
        } else if (dimension != null) {
            availableQuestions = questionRepository.findByDimension_DimensionId(dimension.getDimensionId());
        } else {
            availableQuestions = questionRepository.findBySubject_SubjectId(subject.getSubjectId());
        }

        if (availableQuestions.isEmpty()) {
            // fallback to any questions for this subject
            availableQuestions = questionRepository.findBySubject_SubjectId(subject.getSubjectId());
        }
        if (availableQuestions.isEmpty()) {
            availableQuestions = questionRepository.findAll();
        }

        Collections.shuffle(availableQuestions);
        int take = Math.min(reqCount, availableQuestions.size());
        List<Question> selectedQuestions = availableQuestions.subList(0, take);

        PracticeTest practice = new PracticeTest();
        practice.setUser(user);
        practice.setSubject(subject);
        practice.setTopic(topic);
        practice.setDimension(dimension);
        practice.setQuestionCount(take);
        practice.setStatus("InProgress");
        practice.setQuestionLevel(request.getLevel());
        practice.setCreatedAt(LocalDateTime.now());
        practice = practiceRepository.save(practice);

        TestSession session = new TestSession();
        session.setUser(user);
        session.setTestType("Practice");
        session.setPractice(practice);
        session.setStartedAt(LocalDateTime.now());
        session.setStatus("InProgress");
        session.setCurrentQuestionNo(1);
        session.setDurationSeconds(0);

        String snapshot = selectedQuestions.stream()
                .map(q -> q.getQuestionId().toString())
                .collect(Collectors.joining(","));
        session.setQuestionOrderSnapshot(snapshot);
        session = sessionRepository.save(session);

        for (Question q : selectedQuestions) {
            UserAnswer ua = new UserAnswer();
            ua.setSession(session);
            ua.setQuestion(q);
            ua.setIsMarked(false);
            userAnswerRepository.save(ua);
        }

        SessionStartResponse resp = new SessionStartResponse();
        resp.setSessionId(session.getSessionId());
        resp.setTestType("Practice");
        resp.setTitle("Practice: " + (topic != null ? topic.getLessonName() : subject.getSubjectName()));
        resp.setSubjectName(subject.getSubjectName());
        resp.setDurationMinutes(0); // Count up
        resp.setRemainingSeconds(0);
        resp.setTotalQuestions(take);
        resp.setCurrentQuestionNo(1);
        return resp;
    }

    // Customer: List simulation exams
    public List<Map<String, Object>> listSimulationExams(Long subjectId, String search) {
        List<Quiz> quizzes;
        if (subjectId != null) {
            quizzes = quizRepository.findBySubject_SubjectIdAndTestType(subjectId, "Simulation");
        } else {
            quizzes = quizRepository.findAll().stream()
                    .filter(q -> "Simulation".equalsIgnoreCase(q.getTestType()))
                    .collect(Collectors.toList());
        }

        if (search != null && !search.trim().isEmpty()) {
            String s = search.toLowerCase();
            quizzes = quizzes.stream().filter(q -> q.getQuizName().toLowerCase().contains(s)).collect(Collectors.toList());
        }

        List<Map<String, Object>> list = new ArrayList<>();
        for (Quiz q : quizzes) {
            Map<String, Object> map = new HashMap<>();
            map.put("quizId", q.getQuizId());
            map.put("quizName", q.getQuizName());
            map.put("subjectId", q.getSubject().getSubjectId());
            map.put("subjectName", q.getSubject().getSubjectName());
            map.put("level", q.getLevel());
            map.put("totalQuestions", q.getTotalQuestions());
            map.put("duration", q.getDuration());
            map.put("passRate", q.getPassRate());
            map.put("description", q.getDescription());
            list.add(map);
        }
        return list;
    }

    // Customer: Start Simulation Exam
    @Transactional
    public SessionStartResponse startSimulationExam(Long quizId, User user) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found with id: " + quizId));

        List<QuizQuestionMapping> mappings = mappingRepository.findByQuiz_QuizIdOrderByOrderIndexAsc(quizId);
        List<Question> questions = new ArrayList<>();

        if (!mappings.isEmpty()) {
            for (QuizQuestionMapping m : mappings) {
                questions.add(m.getQuestion());
            }
        } else {
            questions = questionRepository.findBySubject_SubjectId(quiz.getSubject().getSubjectId());
            if (questions.isEmpty()) {
                questions = questionRepository.findAll();
            }
            if (quiz.getIsRandom()) {
                Collections.shuffle(questions);
            }
            int take = Math.min(quiz.getTotalQuestions() > 0 ? quiz.getTotalQuestions() : 20, questions.size());
            questions = questions.subList(0, take);
        }

        TestSession session = new TestSession();
        session.setUser(user);
        session.setTestType("Simulation");
        session.setExam(quiz);
        session.setStartedAt(LocalDateTime.now());
        session.setExpiresAt(LocalDateTime.now().plusMinutes(quiz.getDuration()));
        session.setStatus("InProgress");
        session.setCurrentQuestionNo(1);
        session.setDurationSeconds(quiz.getDuration() * 60);

        String snapshot = questions.stream()
                .map(q -> q.getQuestionId().toString())
                .collect(Collectors.joining(","));
        session.setQuestionOrderSnapshot(snapshot);
        session = sessionRepository.save(session);

        for (Question q : questions) {
            UserAnswer ua = new UserAnswer();
            ua.setSession(session);
            ua.setQuestion(q);
            ua.setIsMarked(false);
            userAnswerRepository.save(ua);
        }

        SessionStartResponse resp = new SessionStartResponse();
        resp.setSessionId(session.getSessionId());
        resp.setTestType("Simulation");
        resp.setTitle(quiz.getQuizName());
        resp.setSubjectName(quiz.getSubject().getSubjectName());
        resp.setDurationMinutes(quiz.getDuration());
        resp.setRemainingSeconds(quiz.getDuration() * 60);
        resp.setTotalQuestions(questions.size());
        resp.setCurrentQuestionNo(1);
        return resp;
    }

    // Customer: Get specific question during Quiz Handle
    public QuestionViewDTO getSessionQuestion(Long sessionId, Integer questionNo, User user) {
        TestSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        List<Long> questionIds = parseQuestionIds(session.getQuestionOrderSnapshot());
        if (questionNo < 1 || questionNo > questionIds.size()) {
            questionNo = 1;
        }

        Long qId = questionIds.get(questionNo - 1);
        Question question = questionRepository.findById(qId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        UserAnswer ua = userAnswerRepository.findBySession_SessionIdAndQuestion_QuestionId(sessionId, qId).orElse(null);

        QuestionViewDTO dto = new QuestionViewDTO();
        dto.setQuestionId(question.getQuestionId());
        dto.setOrderNo(questionNo);
        dto.setTotalQuestions(questionIds.size());
        dto.setContent(question.getContent());
        dto.setLevel(question.getLevel());

        if (question.getMediaList() != null && !question.getMediaList().isEmpty()) {
            QuestionMedia m = question.getMediaList().get(0);
            dto.setMediaUrl(m.getMediaUrl());
            dto.setMediaType(m.getMediaType());
        }

        List<OptionViewDTO> optList = new ArrayList<>();
        String correctAnswerText = "";
        for (QuestionOption opt : question.getOptions()) {
            optList.add(new OptionViewDTO(opt.getOptionId(), opt.getOptionText(), opt.getOrderIndex()));
            if (Boolean.TRUE.equals(opt.getIsCorrect())) {
                correctAnswerText = opt.getOptionText();
            }
        }
        dto.setOptions(optList);

        if (ua != null) {
            if (ua.getSelectedOption() != null) {
                dto.setSelectedOptionId(ua.getSelectedOption().getOptionId());
            }
            dto.setIsMarked(ua.getIsMarked());
        }

        // Peek at answer ONLY for practice mode!
        if ("Practice".equalsIgnoreCase(session.getTestType())) {
            dto.setPeekCorrectAnswer(correctAnswerText);
            dto.setPeekExplanation(question.getExplanation());
        }

        return dto;
    }

    // Customer: Save Answer during Quiz Handle
    @Transactional
    public void submitAnswer(Long sessionId, AnswerSubmitRequest request, User user) {
        TestSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (!"InProgress".equalsIgnoreCase(session.getStatus())) {
            throw new RuntimeException("Cannot answer a submitted exam");
        }

        UserAnswer ua = userAnswerRepository.findBySession_SessionIdAndQuestion_QuestionId(sessionId, request.getQuestionId())
                .orElseGet(() -> {
                    UserAnswer a = new UserAnswer();
                    a.setSession(session);
                    Question q = questionRepository.findById(request.getQuestionId()).orElseThrow();
                    a.setQuestion(q);
                    return a;
                });

        if (request.getSelectedOptionId() != null) {
            QuestionOption opt = optionRepository.findById(request.getSelectedOptionId()).orElse(null);
            ua.setSelectedOption(opt);
            ua.setAnsweredAt(LocalDateTime.now());
        }
        if (request.getIsMarked() != null) {
            ua.setIsMarked(request.getIsMarked());
        }
        ua.setUpdatedAt(LocalDateTime.now());
        userAnswerRepository.save(ua);
    }

    // Customer: Review Progress modal data
    public ExamProgressDTO getExamProgress(Long sessionId) {
        TestSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        List<Long> qIds = parseQuestionIds(session.getQuestionOrderSnapshot());
        List<UserAnswer> answers = userAnswerRepository.findBySession_SessionId(sessionId);
        Map<Long, UserAnswer> ansMap = answers.stream().collect(Collectors.toMap(a -> a.getQuestion().getQuestionId(), a -> a, (k1, k2) -> k1));

        int answered = 0;
        int marked = 0;
        List<QuestionProgressItem> items = new ArrayList<>();

        for (int i = 0; i < qIds.size(); i++) {
            Long qId = qIds.get(i);
            UserAnswer ua = ansMap.get(qId);
            String st = "UNANSWERED";

            if (ua != null) {
                if (Boolean.TRUE.equals(ua.getIsMarked())) {
                    st = "MARKED";
                    marked++;
                } else if (ua.getSelectedOption() != null) {
                    st = "ANSWERED";
                    answered++;
                }
            }
            items.add(new QuestionProgressItem(qId, i + 1, st));
        }

        ExamProgressDTO dto = new ExamProgressDTO();
        dto.setTotalQuestions(qIds.size());
        dto.setAnsweredCount(answered);
        dto.setUnansweredCount(qIds.size() - answered);
        dto.setMarkedCount(marked);
        dto.setQuestions(items);
        return dto;
    }

    // Customer: Score Exam (Submit)
    @Transactional
    public ExamResultDTO scoreExam(Long sessionId, User user) {
        TestSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        List<Long> qIds = parseQuestionIds(session.getQuestionOrderSnapshot());
        List<UserAnswer> answers = userAnswerRepository.findBySession_SessionId(sessionId);
        Map<Long, UserAnswer> ansMap = answers.stream().collect(Collectors.toMap(a -> a.getQuestion().getQuestionId(), a -> a, (k1, k2) -> k1));

        int total = qIds.size();
        int answered = 0;
        int correct = 0;
        int incorrect = 0;

        for (Long qId : qIds) {
            UserAnswer ua = ansMap.get(qId);
            if (ua != null && ua.getSelectedOption() != null) {
                answered++;
                if (Boolean.TRUE.equals(ua.getSelectedOption().getIsCorrect())) {
                    correct++;
                } else {
                    incorrect++;
                }
            }
        }
        int unanswered = total - answered;

        BigDecimal score = total > 0
                ? BigDecimal.valueOf(correct).multiply(BigDecimal.valueOf(100)).divide(BigDecimal.valueOf(total), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        BigDecimal requiredPassRate = BigDecimal.valueOf(50.00);
        if (session.getExam() != null && session.getExam().getPassRate() != null) {
            requiredPassRate = session.getExam().getPassRate();
        }
        boolean isPassed = score.compareTo(requiredPassRate) >= 0;

        session.setStatus("Submitted");
        session.setSubmittedAt(LocalDateTime.now());
        sessionRepository.save(session);

        ExamResult result = examResultRepository.findBySession_SessionId(sessionId).orElseGet(ExamResult::new);
        result.setSession(session);
        result.setUser(session.getUser());
        result.setTotalQuestions(total);
        result.setAnsweredCount(answered);
        result.setCorrectCount(correct);
        result.setIncorrectCount(incorrect);
        result.setUnansweredCount(unanswered);
        result.setScore(score);
        result.setIsPassed(isPassed);
        result.setSubmittedAt(LocalDateTime.now());
        result = examResultRepository.save(result);

        ExamResultDTO dto = new ExamResultDTO();
        dto.setResultId(result.getResultId());
        dto.setSessionId(sessionId);
        dto.setTestType(session.getTestType());
        dto.setTitle(session.getExam() != null ? session.getExam().getQuizName() : "Practice Test");
        dto.setSubjectName(session.getExam() != null ? session.getExam().getSubject().getSubjectName() : session.getPractice().getSubject().getSubjectName());
        dto.setTotalQuestions(total);
        dto.setAnsweredCount(answered);
        dto.setCorrectCount(correct);
        dto.setIncorrectCount(incorrect);
        dto.setUnansweredCount(unanswered);
        dto.setScore(score);
        dto.setIsPassed(isPassed);
        dto.setSubmittedAt(result.getSubmittedAt());

        int durationSec = (int) Duration.between(session.getStartedAt(), result.getSubmittedAt()).getSeconds();
        dto.setDurationSeconds(durationSec);
        return dto;
    }

    // Customer: Quiz Review Screen
    public Map<String, Object> getQuizReview(Long sessionId, User user) {
        TestSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        ExamResult result = examResultRepository.findBySession_SessionId(sessionId)
                .orElseThrow(() -> new RuntimeException("Exam result not found for session"));

        List<Long> qIds = parseQuestionIds(session.getQuestionOrderSnapshot());
        List<UserAnswer> answers = userAnswerRepository.findBySession_SessionId(sessionId);
        Map<Long, UserAnswer> ansMap = answers.stream().collect(Collectors.toMap(a -> a.getQuestion().getQuestionId(), a -> a, (k1, k2) -> k1));

        List<ReviewQuestionDTO> reviewQuestions = new ArrayList<>();

        for (int i = 0; i < qIds.size(); i++) {
            Long qId = qIds.get(i);
            Question q = questionRepository.findById(qId).orElse(null);
            if (q == null) continue;

            UserAnswer ua = ansMap.get(qId);
            ReviewQuestionDTO rq = new ReviewQuestionDTO();
            rq.setQuestionId(q.getQuestionId());
            rq.setOrderNo(i + 1);
            rq.setContent(q.getContent());
            rq.setLevel(q.getLevel());
            rq.setExplanation(q.getExplanation());

            if (q.getMediaList() != null && !q.getMediaList().isEmpty()) {
                rq.setMediaUrl(q.getMediaList().get(0).getMediaUrl());
                rq.setMediaType(q.getMediaList().get(0).getMediaType());
            }

            Long correctOptId = null;
            List<ReviewOptionDTO> optDtos = new ArrayList<>();
            for (QuestionOption opt : q.getOptions()) {
                optDtos.add(new ReviewOptionDTO(opt.getOptionId(), opt.getOptionText(), opt.getIsCorrect(), opt.getOrderIndex()));
                if (Boolean.TRUE.equals(opt.getIsCorrect())) {
                    correctOptId = opt.getOptionId();
                }
            }
            rq.setOptions(optDtos);
            rq.setCorrectOptionId(correctOptId);

            if (ua != null && ua.getSelectedOption() != null) {
                Long selId = ua.getSelectedOption().getOptionId();
                rq.setSelectedOptionId(selId);
                boolean isCorrect = selId.equals(correctOptId);
                rq.setIsCorrect(isCorrect);
                rq.setStatus(isCorrect ? "CORRECT" : "INCORRECT");
                rq.setIsMarked(ua.getIsMarked());
            } else {
                rq.setSelectedOptionId(null);
                rq.setIsCorrect(false);
                rq.setStatus("UNANSWERED");
                rq.setIsMarked(ua != null && Boolean.TRUE.equals(ua.getIsMarked()));
            }

            reviewQuestions.add(rq);
        }

        Map<String, Object> map = new HashMap<>();
        map.put("result", result);
        map.put("session", session);
        map.put("questions", reviewQuestions);
        return map;
    }

    private List<Long> parseQuestionIds(String snapshot) {
        if (snapshot == null || snapshot.trim().isEmpty()) {
            return Collections.emptyList();
        }
        return Arrays.stream(snapshot.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(Long::parseLong)
                .collect(Collectors.toList());
    }
}


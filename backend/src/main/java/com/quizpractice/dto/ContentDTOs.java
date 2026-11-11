package com.quizpractice.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class ContentDTOs {

    public static class SubjectRequest {
        private String subjectName;
        private Long categoryId;
        private Long ownerId;
        private String tagLine;
        private String briefInfo;
        private String description;
        private String thumbnailUrl;
        private Boolean isFeatured = false;
        private String status = "Published";

        public SubjectRequest() {}
        public String getSubjectName() { return subjectName; }
        public void setSubjectName(String subjectName) { this.subjectName = subjectName; }
        public Long getCategoryId() { return categoryId; }
        public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
        public Long getOwnerId() { return ownerId; }
        public void setOwnerId(Long ownerId) { this.ownerId = ownerId; }
        public String getTagLine() { return tagLine; }
        public void setTagLine(String tagLine) { this.tagLine = tagLine; }
        public String getBriefInfo() { return briefInfo; }
        public void setBriefInfo(String briefInfo) { this.briefInfo = briefInfo; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getThumbnailUrl() { return thumbnailUrl; }
        public void setThumbnailUrl(String thumbnailUrl) { this.thumbnailUrl = thumbnailUrl; }
        public Boolean getIsFeatured() { return isFeatured; }
        public void setIsFeatured(Boolean isFeatured) { this.isFeatured = isFeatured; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    public static class DimensionRequest {
        private Long subjectId;
        private Long dimensionTypeId;
        private String dimensionName;
        private String description;

        public DimensionRequest() {}
        public Long getSubjectId() { return subjectId; }
        public void setSubjectId(Long subjectId) { this.subjectId = subjectId; }
        public Long getDimensionTypeId() { return dimensionTypeId; }
        public void setDimensionTypeId(Long dimensionTypeId) { this.dimensionTypeId = dimensionTypeId; }
        public String getDimensionName() { return dimensionName; }
        public void setDimensionName(String dimensionName) { this.dimensionName = dimensionName; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }

    public static class PricePackageRequest {
        private Long subjectId;
        private String packageName;
        private Integer accessDurationMonths;
        private BigDecimal listPrice;
        private BigDecimal salePrice;
        private String status = "Active";
        private String description;

        public PricePackageRequest() {}
        public Long getSubjectId() { return subjectId; }
        public void setSubjectId(Long subjectId) { this.subjectId = subjectId; }
        public String getPackageName() { return packageName; }
        public void setPackageName(String packageName) { this.packageName = packageName; }
        public Integer getAccessDurationMonths() { return accessDurationMonths; }
        public void setAccessDurationMonths(Integer accessDurationMonths) { this.accessDurationMonths = accessDurationMonths; }
        public BigDecimal getListPrice() { return listPrice; }
        public void setListPrice(BigDecimal listPrice) { this.listPrice = listPrice; }
        public BigDecimal getSalePrice() { return salePrice; }
        public void setSalePrice(BigDecimal salePrice) { this.salePrice = salePrice; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }

    public static class LessonRequest {
        private Long subjectId;
        private Long packageId;
        private String lessonName;
        private Long lessonTypeId;
        private Integer displayOrder;
        private String videoLink;
        private String htmlContent;
        private Long quizId;
        private Boolean status = true;

        public LessonRequest() {}
        public Long getSubjectId() { return subjectId; }
        public void setSubjectId(Long subjectId) { this.subjectId = subjectId; }
        public Long getPackageId() { return packageId; }
        public void setPackageId(Long packageId) { this.packageId = packageId; }
        public String getLessonName() { return lessonName; }
        public void setLessonName(String lessonName) { this.lessonName = lessonName; }
        public Long getLessonTypeId() { return lessonTypeId; }
        public void setLessonTypeId(Long lessonTypeId) { this.lessonTypeId = lessonTypeId; }
        public Integer getDisplayOrder() { return displayOrder; }
        public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
        public String getVideoLink() { return videoLink; }
        public void setVideoLink(String videoLink) { this.videoLink = videoLink; }
        public String getHtmlContent() { return htmlContent; }
        public void setHtmlContent(String htmlContent) { this.htmlContent = htmlContent; }
        public Long getQuizId() { return quizId; }
        public void setQuizId(Long quizId) { this.quizId = quizId; }
        public Boolean getStatus() { return status; }
        public void setStatus(Boolean status) { this.status = status; }
    }

    public static class OptionItem {
        private String optionText;
        private Boolean isCorrect = false;
        private String explanation;

        public OptionItem() {}
        public OptionItem(String optionText, Boolean isCorrect) {
            this.optionText = optionText;
            this.isCorrect = isCorrect;
        }

        public String getOptionText() { return optionText; }
        public void setOptionText(String optionText) { this.optionText = optionText; }
        public Boolean getIsCorrect() { return isCorrect; }
        public void setIsCorrect(Boolean isCorrect) { this.isCorrect = isCorrect; }
        public String getExplanation() { return explanation; }
        public void setExplanation(String explanation) { this.explanation = explanation; }
    }

    public static class QuestionRequest {
        private Long subjectId;
        private Long lessonId;
        private Long dimensionId;
        private String content;
        private String level = "Medium";
        private String status = "Published";
        private String explanation;
        private String mediaType;
        private String mediaUrl;
        private List<OptionItem> options;

        public QuestionRequest() {}
        public Long getSubjectId() { return subjectId; }
        public void setSubjectId(Long subjectId) { this.subjectId = subjectId; }
        public Long getLessonId() { return lessonId; }
        public void setLessonId(Long lessonId) { this.lessonId = lessonId; }
        public Long getDimensionId() { return dimensionId; }
        public void setDimensionId(Long dimensionId) { this.dimensionId = dimensionId; }
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
        public String getLevel() { return level; }
        public void setLevel(String level) { this.level = level; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getExplanation() { return explanation; }
        public void setExplanation(String explanation) { this.explanation = explanation; }
        public String getMediaType() { return mediaType; }
        public void setMediaType(String mediaType) { this.mediaType = mediaType; }
        public String getMediaUrl() { return mediaUrl; }
        public void setMediaUrl(String mediaUrl) { this.mediaUrl = mediaUrl; }
        public List<OptionItem> getOptions() { return options; }
        public void setOptions(List<OptionItem> options) { this.options = options; }
    }

    public static class MatrixRuleItem {
        private Long dimensionId;
        private Long lessonId;
        private String questionLevel = "Any";
        private Integer numberOfQuestions = 1;

        public MatrixRuleItem() {}
        public Long getDimensionId() { return dimensionId; }
        public void setDimensionId(Long dimensionId) { this.dimensionId = dimensionId; }
        public Long getLessonId() { return lessonId; }
        public void setLessonId(Long lessonId) { this.lessonId = lessonId; }
        public String getQuestionLevel() { return questionLevel; }
        public void setQuestionLevel(String questionLevel) { this.questionLevel = questionLevel; }
        public Integer getNumberOfQuestions() { return numberOfQuestions; }
        public void setNumberOfQuestions(Integer numberOfQuestions) { this.numberOfQuestions = numberOfQuestions; }
    }

    public static class QuizRequest {
        private Long subjectId;
        private String quizName;
        private String testType = "Simulation";
        private String level = "Medium";
        private Integer duration = 60;
        private BigDecimal passRate = new BigDecimal("70.00");
        private Integer totalQuestions = 10;
        private String description;
        private String status = "Published";
        private List<MatrixRuleItem> matrixRules;

        public QuizRequest() {}
        public Long getSubjectId() { return subjectId; }
        public void setSubjectId(Long subjectId) { this.subjectId = subjectId; }
        public String getQuizName() { return quizName; }
        public void setQuizName(String quizName) { this.quizName = quizName; }
        public String getTestType() { return testType; }
        public void setTestType(String testType) { this.testType = testType; }
        public String getLevel() { return level; }
        public void setLevel(String level) { this.level = level; }
        public Integer getDuration() { return duration; }
        public void setDuration(Integer duration) { this.duration = duration; }
        public BigDecimal getPassRate() { return passRate; }
        public void setPassRate(BigDecimal passRate) { this.passRate = passRate; }
        public Integer getTotalQuestions() { return totalQuestions; }
        public void setTotalQuestions(Integer totalQuestions) { this.totalQuestions = totalQuestions; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public List<MatrixRuleItem> getMatrixRules() { return matrixRules; }
        public void setMatrixRules(List<MatrixRuleItem> matrixRules) { this.matrixRules = matrixRules; }
    }

    public static class RegistrationRequest {
        private Long subjectId;
        private Long packageId;
        private String fullName;
        private String gender;
        private String email;
        private String mobile;
        private String notes;

        public RegistrationRequest() {}
        public Long getSubjectId() { return subjectId; }
        public void setSubjectId(Long subjectId) { this.subjectId = subjectId; }
        public Long getPackageId() { return packageId; }
        public void setPackageId(Long packageId) { this.packageId = packageId; }
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getGender() { return gender; }
        public void setGender(String gender) { this.gender = gender; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getMobile() { return mobile; }
        public void setMobile(String mobile) { this.mobile = mobile; }
        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
    }

    public static class RegistrationUpdateRequest {
        private String status;
        private String notes;
        private LocalDate validFrom;
        private LocalDate validTo;

        public RegistrationUpdateRequest() {}
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
        public LocalDate getValidFrom() { return validFrom; }
        public void setValidFrom(LocalDate validFrom) { this.validFrom = validFrom; }
        public LocalDate getValidTo() { return validTo; }
        public void setValidTo(LocalDate validTo) { this.validTo = validTo; }
    }

    public static class UserManageRequest {
        private String fullName;
        private String gender = "Male";
        private String email;
        private String mobile;
        private String address;
        private String avatarUrl;
        private Long roleId;
        private String status = "Active";
        private String password;

        public UserManageRequest() {}
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getGender() { return gender; }
        public void setGender(String gender) { this.gender = gender; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getMobile() { return mobile; }
        public void setMobile(String mobile) { this.mobile = mobile; }
        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }
        public String getAvatarUrl() { return avatarUrl; }
        public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
        public Long getRoleId() { return roleId; }
        public void setRoleId(Long roleId) { this.roleId = roleId; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class SettingRequest {
        private String type;
        private String value;
        private Integer orderNo = 0;
        private String description;
        private String status = "Active";

        public SettingRequest() {}
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

    public static class SliderRequest {
        private String title;
        private String imageUrl;
        private String backlink;
        private String status = "Show";
        private String notes;

        public SliderRequest() {}
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getImageUrl() { return imageUrl; }
        public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
        public String getBacklink() { return backlink; }
        public void setBacklink(String backlink) { this.backlink = backlink; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
    }

    public static class BlogRequest {
        private Long categoryId;
        private String title;
        private String thumbnailUrl;
        private String briefInfo;
        private String content;
        private Boolean isFeatured = false;
        private String status = "Show";

        public BlogRequest() {}
        public Long getCategoryId() { return categoryId; }
        public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getThumbnailUrl() { return thumbnailUrl; }
        public void setThumbnailUrl(String thumbnailUrl) { this.thumbnailUrl = thumbnailUrl; }
        public String getBriefInfo() { return briefInfo; }
        public void setBriefInfo(String briefInfo) { this.briefInfo = briefInfo; }
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
        public Boolean getIsFeatured() { return isFeatured; }
        public void setIsFeatured(Boolean isFeatured) { this.isFeatured = isFeatured; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    public static class DashboardStatsDTO {
        private long totalUsers;
        private long totalSubjects;
        private long totalRegistrations;
        private long totalPractices;
        private BigDecimal totalRevenue;
        private List<SubjectStat> hotSubjects;

        public DashboardStatsDTO() {}
        public long getTotalUsers() { return totalUsers; }
        public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }
        public long getTotalSubjects() { return totalSubjects; }
        public void setTotalSubjects(long totalSubjects) { this.totalSubjects = totalSubjects; }
        public long getTotalRegistrations() { return totalRegistrations; }
        public void setTotalRegistrations(long totalRegistrations) { this.totalRegistrations = totalRegistrations; }
        public long getTotalPractices() { return totalPractices; }
        public void setTotalPractices(long totalPractices) { this.totalPractices = totalPractices; }
        public BigDecimal getTotalRevenue() { return totalRevenue; }
        public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }
        public List<SubjectStat> getHotSubjects() { return hotSubjects; }
        public void setHotSubjects(List<SubjectStat> hotSubjects) { this.hotSubjects = hotSubjects; }
    }

    public static class SubjectStat {
        private String subjectName;
        private long registrationsCount;
        public SubjectStat(String subjectName, long count) {
            this.subjectName = subjectName;
            this.registrationsCount = count;
        }
        public String getSubjectName() { return subjectName; }
        public long getRegistrationsCount() { return registrationsCount; }
    }
}


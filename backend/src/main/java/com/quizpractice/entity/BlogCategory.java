package com.quizpractice.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Blog_Categories")
public class BlogCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Long categoryId;

    @Column(name = "category_name", length = 100, nullable = false, unique = true)
    private String categoryName;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "status", nullable = false)
    private Boolean status = true;

    public BlogCategory() {}

    public BlogCategory(String categoryName, String description) {
        this.categoryName = categoryName;
        this.description = description;
        this.status = true;
    }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Boolean getStatus() { return status; }
    public void setStatus(Boolean status) { this.status = status; }
}


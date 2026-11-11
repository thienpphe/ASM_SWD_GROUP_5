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
import java.util.List;

@Service
public class BlogService {

    @Autowired
    private BlogRepository blogRepository;

    @Autowired
    private BlogCategoryRepository categoryRepository;

    public Page<Blog> searchPublicBlogs(Long categoryId, String search, Pageable pageable) {
        return blogRepository.searchBlogs("Show", categoryId, search, pageable);
    }

    public List<Blog> getFeaturedBlogs() {
        return blogRepository.findByStatusAndIsFeaturedTrueOrderByCreatedAtDesc("Show");
    }

    public List<Blog> getLatestBlogs() {
        return blogRepository.findTop5ByStatusOrderByCreatedAtDesc("Show");
    }

    public Blog getBlogDetails(Long blogId) {
        return blogRepository.findById(blogId)
                .orElseThrow(() -> new RuntimeException("Blog not found with id: " + blogId));
    }

    public Page<Blog> searchAllBlogs(Long categoryId, String status, String search, Pageable pageable) {
        return blogRepository.searchBlogs(status, categoryId, search, pageable);
    }

    @Transactional
    public Blog createBlog(BlogRequest request, User author) {
        BlogCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Blog category not found"));

        Blog blog = new Blog();
        blog.setCategory(category);
        blog.setAuthor(author);
        blog.setTitle(request.getTitle());
        blog.setThumbnailUrl(request.getThumbnailUrl());
        blog.setBriefInfo(request.getBriefInfo());
        blog.setContent(request.getContent());
        blog.setIsFeatured(request.getIsFeatured() != null ? request.getIsFeatured() : false);
        blog.setStatus(request.getStatus() != null ? request.getStatus() : "Show");
        blog.setCreatedAt(LocalDateTime.now());
        blog.setUpdatedAt(LocalDateTime.now());
        return blogRepository.save(blog);
    }

    @Transactional
    public Blog updateBlog(Long blogId, BlogRequest request) {
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new RuntimeException("Blog not found"));

        if (request.getCategoryId() != null) {
            BlogCategory cat = categoryRepository.findById(request.getCategoryId()).orElse(null);
            if (cat != null) blog.setCategory(cat);
        }
        if (request.getTitle() != null) blog.setTitle(request.getTitle());
        if (request.getThumbnailUrl() != null) blog.setThumbnailUrl(request.getThumbnailUrl());
        if (request.getBriefInfo() != null) blog.setBriefInfo(request.getBriefInfo());
        if (request.getContent() != null) blog.setContent(request.getContent());
        if (request.getIsFeatured() != null) blog.setIsFeatured(request.getIsFeatured());
        if (request.getStatus() != null) blog.setStatus(request.getStatus());
        blog.setUpdatedAt(LocalDateTime.now());

        return blogRepository.save(blog);
    }

    @Transactional
    public Blog toggleBlogStatus(Long blogId) {
        Blog blog = blogRepository.findById(blogId)
                .orElseThrow(() -> new RuntimeException("Blog not found"));
        blog.setStatus("Show".equalsIgnoreCase(blog.getStatus()) ? "Hidden" : "Show");
        blog.setUpdatedAt(LocalDateTime.now());
        return blogRepository.save(blog);
    }

    public List<BlogCategory> getAllCategories() {
        return categoryRepository.findAll();
    }
}


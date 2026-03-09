package com.example.demo.entity;

import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

@Node
public class Job {
    @Id @GeneratedValue
    private Long id;

    private String adzunaId; // Unique ID from API
    private String title;
    private String location;
    private String description;
    private String url;
    private String category;

    @Relationship(type = "POSTED_BY", direction = Relationship.Direction.OUTGOING)
    private Company company;

    public Job() {}

    public Job(String adzunaId, String title, String location, String url, String category, String description, Company company) {
        this.adzunaId = adzunaId;
        this.title = title;
        this.location = location;
        this.url = url;
        this.category = category;
        this.description = description;
        this.company = company;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public String getAdzunaId() {
        return adzunaId;
    }

    public void setAdzunaId(String adzunaId) {
        this.adzunaId = adzunaId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }
}
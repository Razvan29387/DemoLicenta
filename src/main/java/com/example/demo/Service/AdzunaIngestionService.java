package com.example.demo.service;

import com.example.demo.entity.Company;
import com.example.demo.entity.Job;
import com.example.demo.repository.CompanyRepository;
import com.example.demo.repository.JobRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;

@Service
public class AdzunaIngestionService {

    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    // Replace with your actual credentials
    private final String APP_ID = "ef9d97f4";
    private final String APP_KEY = "da6e99c85b206a161efb673b1e8c25fa";
    private final String BASE_URL = "https://api.adzuna.com/v1/api/jobs";

    public AdzunaIngestionService(JobRepository jobRepository, CompanyRepository companyRepository) {
        this.jobRepository = jobRepository;
        this.companyRepository = companyRepository;
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public void importJobs(String country, int startPage, int endPage) {
        System.out.println("Starting import for " + country + " from page " + startPage + " to " + endPage);

        for (int page = startPage; page <= endPage; page++) {
            try {
                String url = String.format("%s/%s/search/%d?app_id=%s&app_key=%s&results_per_page=50&content-type=application/json",
                        BASE_URL, country, page, APP_ID, APP_KEY);

                String jsonResponse = restTemplate.getForObject(url, String.class);
                JsonNode root = objectMapper.readTree(jsonResponse);
                JsonNode results = root.path("results");

                if (results.isArray()) {
                    for (JsonNode jobNode : results) {
                        saveJob(jobNode);
                    }
                }

                System.out.println("Imported page " + page);
                
                // Sleep to respect API rate limits (very important!)
                Thread.sleep(1000); 

            } catch (Exception e) {
                System.err.println("Error importing page " + page + ": " + e.getMessage());
            }
        }
        System.out.println("Import completed.");
    }

    private void saveJob(JsonNode jobNode) {
        String adzunaId = jobNode.path("id").asText();
        
        // Skip if job already exists
        if (jobRepository.existsByAdzunaId(adzunaId)) {
            return;
        }

        String title = jobNode.path("title").asText();
        String url = jobNode.path("redirect_url").asText();
        
        // Extract Company
        String companyName = jobNode.path("company").path("display_name").asText("Unknown Company");
        Company company = findOrCreateCompany(companyName);

        // Extract Location
        String location = jobNode.path("location").path("display_name").asText("Unknown Location");
        
        // Extract Category
        String category = jobNode.path("category").path("label").asText("Uncategorized");

        Job job = new Job(adzunaId, title, location, url, category, company);
        jobRepository.save(job);
    }

    private Company findOrCreateCompany(String name) {
        Optional<Company> existing = companyRepository.findByName(name);
        if (existing.isPresent()) {
            return existing.get();
        }
        Company newCompany = new Company(name);
        return companyRepository.save(newCompany);
    }
}
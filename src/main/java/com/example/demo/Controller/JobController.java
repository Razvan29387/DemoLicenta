package com.example.demo.Controller;

import com.example.demo.Entity.Job;
import com.example.demo.Repository.JobRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
public class JobController {

    private final JobRepository jobRepository;

    public JobController(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    @GetMapping("/jobs")
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    @GetMapping("/jobs/{id}")
    public ResponseEntity<Job> getJobById(@PathVariable Long id) {
        Optional<Job> job = jobRepository.findById(id);
        return job.map(ResponseEntity::ok)
                  .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/jobs/{id}/apply")
    public ResponseEntity<Void> applyToJob(@PathVariable Long id) {
        Optional<Job> job = jobRepository.findById(id);
        if (job.isPresent() && job.get().getUrl() != null) {
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create(job.get().getUrl()))
                    .build();
        }
        return ResponseEntity.notFound().build();
    }
}
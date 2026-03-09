package com.example.demo.repository;

import com.example.demo.entity.Job;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import java.util.Optional;

public interface JobRepository extends Neo4jRepository<Job, Long> {
    boolean existsByAdzunaId(String adzunaId);
    Optional<Job> findByAdzunaId(String adzunaId);
}
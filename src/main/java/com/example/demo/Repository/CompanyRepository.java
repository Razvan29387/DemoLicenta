package com.example.demo.repository;

import com.example.demo.entity.Company;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import java.util.Optional;

public interface CompanyRepository extends Neo4jRepository<Company, Long> {
    Optional<Company> findByName(String name);
}